import { HistoryAction } from "../constants/enums";
import { prisma } from "./prisma";

export const historyRepository = {
  create(data: {
    solicitacaoId: string;
    usuarioId: string;
    acao: HistoryAction;
    observacao: string;
  }) {
    return prisma.reimbursementHistory.create({ data });
  },

  listByReimbursement(solicitacaoId: string) {
    return prisma.reimbursementHistory.findMany({
      where: { solicitacaoId },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            perfil: true
          }
        }
      },
      orderBy: { criadoEm: "asc" }
    });
  }
};
