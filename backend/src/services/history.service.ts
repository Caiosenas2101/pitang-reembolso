import { HistoryAction } from "../constants/enums";
import { historyRepository } from "../repositories/history.repository";

export const historyService = {
  create(data: {
    solicitacaoId: string;
    usuarioId: string;
    acao: HistoryAction;
    observacao: string;
  }) {
    return historyRepository.create(data);
  },

  listByReimbursement(solicitacaoId: string) {
    return historyRepository.listByReimbursement(solicitacaoId);
  }
};
