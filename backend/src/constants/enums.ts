export const UserRole = {
  COLABORADOR: "COLABORADOR",
  GESTOR: "GESTOR",
  FINANCEIRO: "FINANCEIRO",
  ADMIN: "ADMIN"
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const ReimbursementStatus = {
  RASCUNHO: "RASCUNHO",
  ENVIADO: "ENVIADO",
  APROVADO: "APROVADO",
  REJEITADO: "REJEITADO",
  PAGO: "PAGO",
  CANCELADO: "CANCELADO"
} as const;

export type ReimbursementStatus =
  (typeof ReimbursementStatus)[keyof typeof ReimbursementStatus];

export const HistoryAction = {
  CREATED: "CREATED",
  UPDATED: "UPDATED",
  SUBMITTED: "SUBMITTED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PAID: "PAID",
  CANCELED: "CANCELED"
} as const;

export type HistoryAction = (typeof HistoryAction)[keyof typeof HistoryAction];
