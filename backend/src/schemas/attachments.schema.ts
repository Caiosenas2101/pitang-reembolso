import { z } from "zod";

export const createAttachmentSchema = z.object({
  nomeArquivo: z.string().min(1, "Nome do arquivo é obrigatório"),
  urlArquivo: z.string().min(1, "URL do arquivo é obrigatória"),
  tipoArquivo: z
    .string()
    .transform((value) => value.toUpperCase())
    .refine((value) => ["PDF", "JPG", "JPEG", "PNG"].includes(value), {
      message: "Tipo de arquivo não permitido"
    })
});
