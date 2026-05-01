import { Prisma } from "@prisma/client";
import { HistoryAction, ReimbursementStatus, UserRole } from "../constants/enums";
import { AppError } from "../errors/AppError";
import { reimbursementsRepository } from "../repositories/reimbursements.repository";
import { categoriesService } from "./categories.service";
import { historyService } from "./history.service";

type AuthUser = {
  id: string;
  perfil: UserRole;
};

function ensureOwner(reimbursement: { solicitanteId: string }, user: AuthUser) {
  if (reimbursement.solicitanteId !== user.id) {
    throw new AppError("Usuário não tem permissão para esta solicitação", 403, "Forbidden");
  }
}

async function getRequiredReimbursement(id: string) {
  const reimbursement = await reimbursementsRepository.findById(id);

  if (!reimbursement) {
    throw new AppError("Solicitação de reembolso não encontrada", 404, "Not Found");
  }

  return reimbursement;
}

export const reimbursementsService = {
  async create(
    user: AuthUser,
    data: {
      categoriaId: string;
      descricao: string;
      valor: number;
      dataDespesa: Date;
    }
  ) {
    await categoriesService.ensureActive(data.categoriaId);

    const reimbursement = await reimbursementsRepository.create({
      ...data,
      solicitanteId: user.id
    });

    await historyService.create({
      solicitacaoId: reimbursement.id,
      usuarioId: user.id,
      acao: HistoryAction.CREATED,
      observacao: "Solicitação criada pelo colaborador"
    });

    return reimbursement;
  },

  async list(user: AuthUser, filters: { status?: ReimbursementStatus; categoriaId?: string }) {
    const where: Prisma.ReimbursementWhereInput = {};

    if (filters.status) where.status = filters.status;
    if (filters.categoriaId) where.categoriaId = filters.categoriaId;

    if (user.perfil === UserRole.COLABORADOR) {
      where.solicitanteId = user.id;
    }

    if (user.perfil === UserRole.GESTOR && !filters.status) {
      where.status = ReimbursementStatus.ENVIADO;
    }

    if (user.perfil === UserRole.FINANCEIRO && !filters.status) {
      where.status = ReimbursementStatus.APROVADO;
    }

    return reimbursementsRepository.list(where);
  },

  async findById(user: AuthUser, id: string) {
    const reimbursement = await getRequiredReimbursement(id);

    if (user.perfil === UserRole.COLABORADOR) {
      ensureOwner(reimbursement, user);
    }

    return reimbursement;
  },

  async update(
    user: AuthUser,
    id: string,
    data: {
      categoriaId?: string;
      descricao?: string;
      valor?: number;
      dataDespesa?: Date;
    }
  ) {
    const reimbursement = await getRequiredReimbursement(id);
    ensureOwner(reimbursement, user);

    if (reimbursement.status !== ReimbursementStatus.RASCUNHO) {
      throw new AppError("Apenas solicitações em rascunho podem ser editadas", 400, "Bad Request");
    }

    if (data.categoriaId) {
      await categoriesService.ensureActive(data.categoriaId);
    }

    const updated = await reimbursementsRepository.update(id, data);

    await historyService.create({
      solicitacaoId: id,
      usuarioId: user.id,
      acao: HistoryAction.UPDATED,
      observacao: "Solicitação atualizada pelo colaborador"
    });

    return updated;
  },

  async submit(user: AuthUser, id: string) {
    const reimbursement = await getRequiredReimbursement(id);
    ensureOwner(reimbursement, user);

    if (reimbursement.status !== ReimbursementStatus.RASCUNHO) {
      throw new AppError("Apenas solicitações em rascunho podem ser enviadas", 400, "Bad Request");
    }

    const updated = await reimbursementsRepository.changeStatus(id, ReimbursementStatus.ENVIADO);

    await historyService.create({
      solicitacaoId: id,
      usuarioId: user.id,
      acao: HistoryAction.SUBMITTED,
      observacao: "Solicitação enviada para análise"
    });

    return updated;
  },

  async approve(user: AuthUser, id: string) {
    const reimbursement = await getRequiredReimbursement(id);

    if (reimbursement.status !== ReimbursementStatus.ENVIADO) {
      throw new AppError("Apenas solicitações enviadas podem ser aprovadas", 400, "Bad Request");
    }

    const updated = await reimbursementsRepository.changeStatus(id, ReimbursementStatus.APROVADO);

    await historyService.create({
      solicitacaoId: id,
      usuarioId: user.id,
      acao: HistoryAction.APPROVED,
      observacao: "Solicitação aprovada pelo gestor"
    });

    return updated;
  },

  async reject(user: AuthUser, id: string, justificativaRejeicao: string) {
    const reimbursement = await getRequiredReimbursement(id);

    if (reimbursement.status !== ReimbursementStatus.ENVIADO) {
      throw new AppError("Apenas solicitações enviadas podem ser rejeitadas", 400, "Bad Request");
    }

    const updated = await reimbursementsRepository.changeStatus(id, ReimbursementStatus.REJEITADO, {
      justificativaRejeicao
    });

    await historyService.create({
      solicitacaoId: id,
      usuarioId: user.id,
      acao: HistoryAction.REJECTED,
      observacao: justificativaRejeicao
    });

    return updated;
  },

  async pay(user: AuthUser, id: string) {
    const reimbursement = await getRequiredReimbursement(id);

    if (reimbursement.status !== ReimbursementStatus.APROVADO) {
      throw new AppError("Apenas solicitações aprovadas podem ser pagas", 400, "Bad Request");
    }

    const updated = await reimbursementsRepository.changeStatus(id, ReimbursementStatus.PAGO);

    await historyService.create({
      solicitacaoId: id,
      usuarioId: user.id,
      acao: HistoryAction.PAID,
      observacao: "Pagamento realizado pelo financeiro"
    });

    return updated;
  },

  async cancel(user: AuthUser, id: string) {
    const reimbursement = await getRequiredReimbursement(id);
    ensureOwner(reimbursement, user);

    const cancelableStatuses: string[] = [
      ReimbursementStatus.RASCUNHO,
      ReimbursementStatus.ENVIADO
    ];

    if (!cancelableStatuses.includes(reimbursement.status)) {
      throw new AppError(
        "Apenas solicitações em rascunho ou enviadas podem ser canceladas",
        400,
        "Bad Request"
      );
    }

    const updated = await reimbursementsRepository.changeStatus(id, ReimbursementStatus.CANCELADO);

    await historyService.create({
      solicitacaoId: id,
      usuarioId: user.id,
      acao: HistoryAction.CANCELED,
      observacao: "Solicitação cancelada pelo colaborador"
    });

    return updated;
  },

  async listHistory(user: AuthUser, id: string) {
    await this.findById(user, id);
    return historyService.listByReimbursement(id);
  }
};
