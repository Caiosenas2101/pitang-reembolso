import { UserRole } from "../constants/enums";
import { z } from "zod";

export const createUserSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  perfil: z.nativeEnum(UserRole)
});
