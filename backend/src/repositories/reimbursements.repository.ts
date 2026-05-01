import { Prisma } from "@prisma/client";
import { ReimbursementStatus } from "../constants/enums";
import { prisma } from "./prisma";

const includeRelations = {
  categoria: true,
  solicitante: {
    select: {
      id: true,
      nome: true,
      email: true,
      perfil: true
    }
  },
  anexos: true
} satisfies Prisma.ReimbursementInclude;

export const reimbursementsRepository = {
  create(data: {
    solicitanteId: string;
    categoriaId: string;
    descricao: string;
    valor: number;
    dataDespesa: Date;
  }) {
    return prisma.reimbursement.create({
      data,
      include: includeRelations
    });
  },

  findById(id: string) {
    return prisma.reimbursement.findUnique({
      where: { id },
      include: includeRelations
    });
  },

  list(where: Prisma.ReimbursementWhereInput) {
    return prisma.reimbursement.findMany({
      where,
      include: includeRelations,
      orderBy: { criadoEm: "desc" }
    });
  },

  update(id: string, data: Prisma.ReimbursementUpdateInput) {
    return prisma.reimbursement.update({
      where: { id },
      data,
      include: includeRelations
    });
  },

  changeStatus(id: string, status: ReimbursementStatus, extra?: Prisma.ReimbursementUpdateInput) {
    return prisma.reimbursement.update({
      where: { id },
      data: {
        ...extra,
        status
      },
      include: includeRelations
    });
  }
};
