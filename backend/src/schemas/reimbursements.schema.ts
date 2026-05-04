import { ReimbursementStatus } from "../constants/enums";
import { z } from "zod";

export const createReimbursementSchema = z.object({
  categoriaId: z.string().uuid("Categoria inválida"),
  descricao: z.string().min(3, "Descrição é obrigatória"),
  valor: z.coerce.number().positive("Valor deve ser maior que zero"),
  dataDespesa: z.coerce.date({
    invalid_type_error: "Data da despesa é obrigatória"
  })
});

export const updateReimbursementSchema = createReimbursementSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  "Informe pelo menos um campo para atualizar"
);

export const rejectReimbursementSchema = z.object({
  justificativaRejeicao: z.string().min(3, "Justificativa de rejeição é obrigatória")
});

export const listReimbursementsQuerySchema = z.object({
  status: z.nativeEnum(ReimbursementStatus).optional(),
  categoriaId: z.string().uuid("Categoria inválida").optional(),
  colaborador: z.string().trim().optional(),
  sortBy: z.enum(["dataDespesa", "valor"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional()
});
