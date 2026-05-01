import { z } from "zod";

export const createCategorySchema = z.object({
  nome: z.string().min(2, "Nome da categoria é obrigatório"),
  ativo: z.boolean().optional()
});

export const updateCategorySchema = createCategorySchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  "Informe pelo menos um campo para atualizar"
);
