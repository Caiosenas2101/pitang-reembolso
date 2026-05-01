import request from "supertest";
import { app } from "../app";
import { HistoryAction, ReimbursementStatus, UserRole } from "../constants/enums";
import { prisma } from "../repositories/prisma";
import { hashPassword } from "../utils/password";

async function resetDatabase() {
  await prisma.reimbursementHistory.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.reimbursement.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
}

async function createUser(perfil: UserRole, email: string) {
  return prisma.user.create({
    data: {
      nome: `${perfil} Teste`,
      email,
      perfil,
      senha: await hashPassword("123456")
    }
  });
}

async function login(email: string) {
  const response = await request(app).post("/auth/login").send({
    email,
    senha: "123456"
  });

  return response.body.token as string;
}

async function createCategory(ativo = true) {
  return prisma.category.create({
    data: {
      nome: ativo ? "Transporte" : "Categoria Inativa",
      ativo
    }
  });
}

describe("API", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  it("retorna healthcheck", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("bloqueia rotas privadas sem token", async () => {
    const response = await request(app).get("/reimbursements");

    expect(response.status).toBe(401);
  });

  it("valida payload de cadastro de usuário", async () => {
    const response = await request(app).post("/users").send({
      nome: "A",
      email: "email-invalido",
      senha: "123",
      perfil: UserRole.COLABORADOR
    });

    expect(response.status).toBe(400);
  });

  it("autentica usuário com JWT e rejeita credenciais inválidas", async () => {
    await createUser(UserRole.COLABORADOR, "colaborador@teste.com");

    const success = await request(app).post("/auth/login").send({
      email: "colaborador@teste.com",
      senha: "123456"
    });

    expect(success.status).toBe(200);
    expect(success.body.token).toBeDefined();
    expect(success.body.user).toMatchObject({
      email: "colaborador@teste.com",
      perfil: UserRole.COLABORADOR
    });

    const failure = await request(app).post("/auth/login").send({
      email: "colaborador@teste.com",
      senha: "senha-errada"
    });

    expect(failure.status).toBe(401);
  });

  it("permite apenas ADMIN criar categorias", async () => {
    await createUser(UserRole.ADMIN, "admin@teste.com");
    await createUser(UserRole.COLABORADOR, "colaborador@teste.com");

    const adminToken = await login("admin@teste.com");
    const collaboratorToken = await login("colaborador@teste.com");

    const forbidden = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${collaboratorToken}`)
      .send({ nome: "Hospedagem" });

    expect(forbidden.status).toBe(403);

    const created = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ nome: "Hospedagem" });

    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({
      nome: "Hospedagem",
      ativo: true
    });
  });

  it("executa o fluxo obrigatório de solicitação até pagamento e registra histórico", async () => {
    await createUser(UserRole.COLABORADOR, "colaborador@teste.com");
    await createUser(UserRole.GESTOR, "gestor@teste.com");
    await createUser(UserRole.FINANCEIRO, "financeiro@teste.com");
    const category = await createCategory();

    const collaboratorToken = await login("colaborador@teste.com");
    const managerToken = await login("gestor@teste.com");
    const financeToken = await login("financeiro@teste.com");

    const created = await request(app)
      .post("/reimbursements")
      .set("Authorization", `Bearer ${collaboratorToken}`)
      .send({
        categoriaId: category.id,
        descricao: "Taxi para reunião",
        valor: 42.5,
        dataDespesa: "2026-04-20"
      });

    expect(created.status).toBe(201);
    expect(created.body.status).toBe(ReimbursementStatus.RASCUNHO);

    const updated = await request(app)
      .put(`/reimbursements/${created.body.id}`)
      .set("Authorization", `Bearer ${collaboratorToken}`)
      .send({ descricao: "Taxi para reunião com cliente" });

    expect(updated.status).toBe(200);
    expect(updated.body.descricao).toBe("Taxi para reunião com cliente");

    const submitted = await request(app)
      .post(`/reimbursements/${created.body.id}/submit`)
      .set("Authorization", `Bearer ${collaboratorToken}`);

    expect(submitted.status).toBe(200);
    expect(submitted.body.status).toBe(ReimbursementStatus.ENVIADO);

    const forbiddenApproval = await request(app)
      .post(`/reimbursements/${created.body.id}/approve`)
      .set("Authorization", `Bearer ${collaboratorToken}`);

    expect(forbiddenApproval.status).toBe(403);

    const approved = await request(app)
      .post(`/reimbursements/${created.body.id}/approve`)
      .set("Authorization", `Bearer ${managerToken}`);

    expect(approved.status).toBe(200);
    expect(approved.body.status).toBe(ReimbursementStatus.APROVADO);

    const paid = await request(app)
      .post(`/reimbursements/${created.body.id}/pay`)
      .set("Authorization", `Bearer ${financeToken}`);

    expect(paid.status).toBe(200);
    expect(paid.body.status).toBe(ReimbursementStatus.PAGO);

    const editPaid = await request(app)
      .put(`/reimbursements/${created.body.id}`)
      .set("Authorization", `Bearer ${collaboratorToken}`)
      .send({ descricao: "Tentativa inválida" });

    expect(editPaid.status).toBe(400);

    const history = await request(app)
      .get(`/reimbursements/${created.body.id}/history`)
      .set("Authorization", `Bearer ${collaboratorToken}`);

    expect(history.status).toBe(200);
    expect(history.body.map((item: { acao: string }) => item.acao)).toEqual([
      HistoryAction.CREATED,
      HistoryAction.UPDATED,
      HistoryAction.SUBMITTED,
      HistoryAction.APPROVED,
      HistoryAction.PAID
    ]);
  });

  it("rejeita solicitação enviada somente com justificativa obrigatória", async () => {
    await createUser(UserRole.COLABORADOR, "colaborador@teste.com");
    await createUser(UserRole.GESTOR, "gestor@teste.com");
    const category = await createCategory();

    const collaboratorToken = await login("colaborador@teste.com");
    const managerToken = await login("gestor@teste.com");

    const created = await request(app)
      .post("/reimbursements")
      .set("Authorization", `Bearer ${collaboratorToken}`)
      .send({
        categoriaId: category.id,
        descricao: "Almoço em viagem",
        valor: 80,
        dataDespesa: "2026-04-19"
      });

    await request(app)
      .post(`/reimbursements/${created.body.id}/submit`)
      .set("Authorization", `Bearer ${collaboratorToken}`);

    const withoutReason = await request(app)
      .post(`/reimbursements/${created.body.id}/reject`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send({});

    expect(withoutReason.status).toBe(400);

    const rejected = await request(app)
      .post(`/reimbursements/${created.body.id}/reject`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send({ justificativaRejeicao: "Comprovante incompleto" });

    expect(rejected.status).toBe(200);
    expect(rejected.body).toMatchObject({
      status: ReimbursementStatus.REJEITADO,
      justificativaRejeicao: "Comprovante incompleto"
    });
  });

  it("bloqueia solicitação com categoria inativa", async () => {
    await createUser(UserRole.COLABORADOR, "colaborador@teste.com");
    const inactiveCategory = await createCategory(false);
    const collaboratorToken = await login("colaborador@teste.com");

    const response = await request(app)
      .post("/reimbursements")
      .set("Authorization", `Bearer ${collaboratorToken}`)
      .send({
        categoriaId: inactiveCategory.id,
        descricao: "Despesa inválida",
        valor: 10,
        dataDespesa: "2026-04-18"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Categoria não encontrada ou inativa");
  });

  it("valida tipos permitidos em anexos simulados", async () => {
    await createUser(UserRole.COLABORADOR, "colaborador@teste.com");
    const category = await createCategory();
    const collaboratorToken = await login("colaborador@teste.com");

    const created = await request(app)
      .post("/reimbursements")
      .set("Authorization", `Bearer ${collaboratorToken}`)
      .send({
        categoriaId: category.id,
        descricao: "Estacionamento",
        valor: 25,
        dataDespesa: "2026-04-17"
      });

    const invalidAttachment = await request(app)
      .post(`/reimbursements/${created.body.id}/attachments`)
      .set("Authorization", `Bearer ${collaboratorToken}`)
      .send({
        nomeArquivo: "comprovante.exe",
        urlArquivo: "https://exemplo.com/comprovante.exe",
        tipoArquivo: "exe"
      });

    expect(invalidAttachment.status).toBe(400);

    const validAttachment = await request(app)
      .post(`/reimbursements/${created.body.id}/attachments`)
      .set("Authorization", `Bearer ${collaboratorToken}`)
      .send({
        nomeArquivo: "comprovante.pdf",
        urlArquivo: "https://exemplo.com/comprovante.pdf",
        tipoArquivo: "pdf"
      });

    expect(validAttachment.status).toBe(201);
    expect(validAttachment.body).toMatchObject({
      nomeArquivo: "comprovante.pdf",
      tipoArquivo: "PDF"
    });
  });

  it("bloqueia anexo após envio da solicitação", async () => {
    await createUser(UserRole.COLABORADOR, "colaborador@teste.com");
    const category = await createCategory();
    const collaboratorToken = await login("colaborador@teste.com");

    const created = await request(app)
      .post("/reimbursements")
      .set("Authorization", `Bearer ${collaboratorToken}`)
      .send({
        categoriaId: category.id,
        descricao: "Almoço",
        valor: 40,
        dataDespesa: "2026-04-17"
      });

    await request(app)
      .post(`/reimbursements/${created.body.id}/submit`)
      .set("Authorization", `Bearer ${collaboratorToken}`)
      .expect(200);

    const attachmentAfterSubmit = await request(app)
      .post(`/reimbursements/${created.body.id}/attachments`)
      .set("Authorization", `Bearer ${collaboratorToken}`)
      .send({
        nomeArquivo: "nota.pdf",
        urlArquivo: "https://exemplo.com/nota.pdf",
        tipoArquivo: "pdf"
      });

    expect(attachmentAfterSubmit.status).toBe(400);
    expect(attachmentAfterSubmit.body.message).toBe(
      "Apenas solicitações em rascunho podem receber anexos"
    );
  });

  it("permite colaborador dono cancelar solicitação enviada", async () => {
    await createUser(UserRole.COLABORADOR, "colaborador@teste.com");
    const category = await createCategory();
    const collaboratorToken = await login("colaborador@teste.com");

    const created = await request(app)
      .post("/reimbursements")
      .set("Authorization", `Bearer ${collaboratorToken}`)
      .send({
        categoriaId: category.id,
        descricao: "Transporte",
        valor: 30,
        dataDespesa: "2026-04-16"
      });

    await request(app)
      .post(`/reimbursements/${created.body.id}/submit`)
      .set("Authorization", `Bearer ${collaboratorToken}`)
      .expect(200);

    const canceled = await request(app)
      .post(`/reimbursements/${created.body.id}/cancel`)
      .set("Authorization", `Bearer ${collaboratorToken}`);

    expect(canceled.status).toBe(200);
    expect(canceled.body.status).toBe(ReimbursementStatus.CANCELADO);

    const history = await request(app)
      .get(`/reimbursements/${created.body.id}/history`)
      .set("Authorization", `Bearer ${collaboratorToken}`);

    expect(history.body.map((item: { acao: string }) => item.acao)).toEqual([
      HistoryAction.CREATED,
      HistoryAction.SUBMITTED,
      HistoryAction.CANCELED
    ]);
  });
});
