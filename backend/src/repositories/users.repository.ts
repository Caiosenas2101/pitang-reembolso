import { Prisma } from "@prisma/client";
import { UserRole } from "../constants/enums";
import { prisma } from "./prisma";

export const usersRepository = {
  create(data: { nome: string; email: string; senha: string; perfil: UserRole }) {
    return prisma.user.create({ data });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  list() {
    return prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        criadoEm: true,
        atualizadoEm: true
      },
      orderBy: { nome: "asc" }
    });
  },

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  }
};
