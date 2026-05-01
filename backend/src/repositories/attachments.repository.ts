import { prisma } from "./prisma";

export const attachmentsRepository = {
  create(data: {
    solicitacaoId: string;
    nomeArquivo: string;
    urlArquivo: string;
    tipoArquivo: string;
  }) {
    return prisma.attachment.create({ data });
  },

  listByReimbursement(solicitacaoId: string) {
    return prisma.attachment.findMany({
      where: { solicitacaoId },
      orderBy: { criadoEm: "desc" }
    });
  }
};
