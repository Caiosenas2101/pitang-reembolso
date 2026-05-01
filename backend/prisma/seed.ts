import { PrismaClient } from "@prisma/client";
import { UserRole } from "../src/constants/enums";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

async function upsertUser(nome: string, email: string, perfil: UserRole) {
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      nome,
      email,
      perfil,
      senha: await hashPassword("123456")
    }
  });
}

async function main() {
  await upsertUser("Colaborador Teste", "colaborador@teste.com", UserRole.COLABORADOR);
  await upsertUser("Gestor Teste", "gestor@teste.com", UserRole.GESTOR);
  await upsertUser("Financeiro Teste", "financeiro@teste.com", UserRole.FINANCEIRO);
  await upsertUser("Admin Teste", "admin@teste.com", UserRole.ADMIN);

  await prisma.category.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      nome: "Transporte",
      ativo: true
    }
  });

  await prisma.category.upsert({
    where: { id: "00000000-0000-0000-0000-000000000002" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000002",
      nome: "Alimentação",
      ativo: true
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
