import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { listCategories } from "../services/categories.service";
import { listReimbursements } from "../services/reimbursements.service";

jest.mock("../services/categories.service", () => ({
  listCategories: jest.fn()
}));

jest.mock("../services/reimbursements.service", () => ({
  listReimbursements: jest.fn()
}));

const baseReimbursement = {
  id: "reembolso-1",
  solicitanteId: "usuario-1",
  categoriaId: "categoria-1",
  descricao: "Despesa",
  valor: 10,
  dataDespesa: "2026-05-01",
  status: "ENVIADO",
  criadoEm: "2026-05-01",
  atualizadoEm: "2026-05-01",
  categoria: {
    id: "categoria-1",
    nome: "Transporte",
    ativo: true,
    criadoEm: "2026-05-01",
    atualizadoEm: "2026-05-01"
  },
  solicitante: {
    id: "usuario-1",
    nome: "Ana Silva",
    email: "ana@teste.com",
    perfil: "COLABORADOR"
  }
};

describe("Dashboard", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();

    localStorage.setItem("token", "token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "admin-1",
        nome: "Admin",
        email: "admin@teste.com",
        perfil: "ADMIN"
      })
    );

    (listCategories as jest.Mock).mockResolvedValue([
      {
        id: "categoria-1",
        nome: "Transporte",
        ativo: true,
        criadoEm: "2026-05-01",
        atualizadoEm: "2026-05-01"
      }
    ]);

    (listReimbursements as jest.Mock).mockResolvedValue([]);
  });

  it("envia filtros de status e categoria para a API", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );

    await screen.findByLabelText("Status");
    await user.selectOptions(screen.getByLabelText("Status"), "APROVADO");
    await user.selectOptions(screen.getByLabelText("Categoria"), "categoria-1");
    await user.click(screen.getByRole("button", { name: "Aplicar filtros" }));

    await waitFor(() => {
      expect(listReimbursements).toHaveBeenLastCalledWith({
        status: "APROVADO",
        categoriaId: "categoria-1",
        sortBy: "dataDespesa",
        sortOrder: "desc"
      });
    });
  });

  it("envia busca por colaborador para a API", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );

    await screen.findByLabelText("Colaborador");
    await user.type(screen.getByLabelText("Colaborador"), "Ana");
    await user.click(screen.getByRole("button", { name: "Aplicar filtros" }));

    await waitFor(() => {
      expect(listReimbursements).toHaveBeenLastCalledWith({
        colaborador: "Ana",
        sortBy: "dataDespesa",
        sortOrder: "desc"
      });
    });
  });

  it("envia ordenação escolhida para a API", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );

    await screen.findByLabelText("Ordenação");
    await user.selectOptions(screen.getByLabelText("Ordenação"), "valor:desc");
    await user.click(screen.getByRole("button", { name: "Aplicar filtros" }));

    await waitFor(() => {
      expect(listReimbursements).toHaveBeenLastCalledWith({
        sortBy: "valor",
        sortOrder: "desc"
      });
    });
  });

  it("envia ordenação por data antiga para a API", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );

    await screen.findByLabelText("Ordenação");
    await user.selectOptions(screen.getByLabelText("Ordenação"), "dataDespesa:asc");
    await user.click(screen.getByRole("button", { name: "Aplicar filtros" }));

    await waitFor(() => {
      expect(listReimbursements).toHaveBeenLastCalledWith({
        sortBy: "dataDespesa",
        sortOrder: "asc"
      });
    });
  });

  it("reordena as solicitações exibidas ao aplicar ordenação por valor", async () => {
    const user = userEvent.setup();

    (listReimbursements as jest.Mock).mockResolvedValue([
      {
        ...baseReimbursement,
        id: "reembolso-barato",
        descricao: "Despesa barata",
        valor: 10,
        dataDespesa: "2026-05-02"
      },
      {
        ...baseReimbursement,
        id: "reembolso-caro",
        descricao: "Despesa cara",
        valor: 100,
        dataDespesa: "2026-05-01"
      }
    ]);

    render(
      <MemoryRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );

    await screen.findByText("Despesa barata");
    await user.selectOptions(screen.getByLabelText("Ordenação"), "valor:desc");
    await user.click(screen.getByRole("button", { name: "Aplicar filtros" }));

    await waitFor(() => {
      const rows = screen.getAllByRole("row").slice(1);

      expect(rows[0]).toHaveTextContent("Despesa cara");
      expect(rows[1]).toHaveTextContent("Despesa barata");
    });
  });

  it("filtra as solicitações exibidas por colaborador ao aplicar filtros", async () => {
    const user = userEvent.setup();

    (listReimbursements as jest.Mock).mockResolvedValue([
      {
        ...baseReimbursement,
        id: "reembolso-ana",
        descricao: "Despesa da Ana",
        solicitante: {
          id: "usuario-ana",
          nome: "Ana Silva",
          email: "ana@teste.com",
          perfil: "COLABORADOR"
        }
      },
      {
        ...baseReimbursement,
        id: "reembolso-caio",
        descricao: "Despesa do Caio",
        solicitante: {
          id: "usuario-caio",
          nome: "Caio Sena",
          email: "caio@teste.com",
          perfil: "COLABORADOR"
        }
      }
    ]);

    render(
      <MemoryRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );

    await screen.findByText("Despesa da Ana");
    await user.type(screen.getByLabelText("Colaborador"), "caio sena");
    await user.click(screen.getByRole("button", { name: "Aplicar filtros" }));

    await waitFor(() => {
      expect(screen.getByText("Despesa do Caio")).toBeInTheDocument();
      expect(screen.queryByText("Despesa da Ana")).not.toBeInTheDocument();
    });
  });
});
