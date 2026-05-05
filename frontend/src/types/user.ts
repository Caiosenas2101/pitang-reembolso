export type UserRole = "COLABORADOR" | "GESTOR" | "FINANCEIRO" | "ADMIN";

export type User = {
  id: string;
  nome: string;
  email: string;
  perfil: UserRole;
  criadoEm?: string;
  atualizadoEm?: string;
};
