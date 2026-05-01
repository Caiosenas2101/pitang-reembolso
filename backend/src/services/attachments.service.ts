import { ReimbursementStatus, UserRole } from "../constants/enums";
import { AppError } from "../errors/AppError";
import { attachmentsRepository } from "../repositories/attachments.repository";
import { reimbursementsRepository } from "../repositories/reimbursements.repository";

type AuthUser = {
  id: string;
  perfil: UserRole;
};

async function getRequiredReimbursement(id: string) {
  const reimbursement = await reimbursementsRepository.findById(id);

  if (!reimbursement) {
    throw new AppError("Solicitação de reembolso não encontrada", 404, "Not Found");
  }

  return reimbursement;
}

function ensureOwner(user: AuthUser, solicitanteId: string) {
  if (user.id !== solicitanteId) {
    throw new AppError("Usuário não tem permissão para anexar nesta solicitação", 403, "Forbidden");
  }
}

export const attachmentsService = {
  async create(
    user: AuthUser,
    solicitacaoId: string,
    data: { nomeArquivo: string; urlArquivo: string; tipoArquivo: string }
  ) {
    const reimbursement = await getRequiredReimbursement(solicitacaoId);
    ensureOwner(user, reimbursement.solicitanteId);

    if (reimbursement.status !== ReimbursementStatus.RASCUNHO) {
      throw new AppError(
        "Apenas solicitações em rascunho podem receber anexos",
        400,
        "Bad Request"
      );
    }

    return attachmentsRepository.create({
      solicitacaoId,
      ...data
    });
  },

  async list(user: AuthUser, solicitacaoId: string) {
    const reimbursement = await getRequiredReimbursement(solicitacaoId);

    if (user.perfil === UserRole.COLABORADOR) {
      ensureOwner(user, reimbursement.solicitanteId);
    }

    return attachmentsRepository.listByReimbursement(solicitacaoId);
  }
};
