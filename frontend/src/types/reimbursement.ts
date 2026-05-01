import { Category } from "./category";
import { User } from "./user";

export type ReimbursementStatus =
  | "RASCUNHO"
  | "ENVIADO"
  | "APROVADO"
  | "REJEITADO"
  | "PAGO"
  | "CANCELADO";

export type Reimbursement = {
  id: string;
  solicitanteId: string;
  categoriaId: string;
  descricao: string;
  valor: string | number;
  dataDespesa: string;
  status: ReimbursementStatus;
  justificativaRejeicao?: string | null;
  criadoEm: string;
  atualizadoEm: string;
  categoria?: Category;
  solicitante?: Pick<User, "id" | "nome" | "email" | "perfil">;
  anexos?: Attachment[];
};

export type Attachment = {
  id: string;
  solicitacaoId: string;
  nomeArquivo: string;
  urlArquivo: string;
  tipoArquivo: string;
  criadoEm: string;
};

export type ReimbursementHistory = {
  id: string;
  solicitacaoId: string;
  usuarioId: string;
  acao: string;
  observacao: string;
  criadoEm: string;
  usuario?: Pick<User, "id" | "nome" | "email" | "perfil">;
};
