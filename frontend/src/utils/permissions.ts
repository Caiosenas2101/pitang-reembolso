import { Reimbursement } from "../types/reimbursement";
import { User } from "../types/user";

export function canEdit(user: User | null, reimbursement: Reimbursement) {
  return (
    user?.perfil === "COLABORADOR" &&
    reimbursement.solicitanteId === user.id &&
    reimbursement.status === "RASCUNHO"
  );
}

export function canSubmit(user: User | null, reimbursement: Reimbursement) {
  return canEdit(user, reimbursement);
}

export function canCancel(user: User | null, reimbursement: Reimbursement) {
  return canEdit(user, reimbursement);
}

export function canApproveOrReject(user: User | null, reimbursement: Reimbursement) {
  return user?.perfil === "GESTOR" && reimbursement.status === "ENVIADO";
}

export function canPay(user: User | null, reimbursement: Reimbursement) {
  return user?.perfil === "FINANCEIRO" && reimbursement.status === "APROVADO";
}
