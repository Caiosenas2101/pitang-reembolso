import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export const categoriesRepository = {
  create(data: { nome: string; ativo?: boolean }) {
    return prisma.category.create({ data });
  },

  list() {
    return prisma.category.findMany({ orderBy: { nome: "asc" } });
  },

  findById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  },

  update(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({ where: { id }, data });
  }
};
