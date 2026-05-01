import { AppError } from "../errors/AppError";
import { usersRepository } from "../repositories/users.repository";
import { comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { UserRole } from "../constants/enums";

export const authService = {
  async login(email: string, senha: string) {
    const user = await usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Credenciais inválidas", 401, "Unauthorized");
    }

    const passwordMatches = await comparePassword(senha, user.senha);

    if (!passwordMatches) {
      throw new AppError("Credenciais inválidas", 401, "Unauthorized");
    }

    const token = signToken({
      sub: user.id,
      email: user.email,
      perfil: user.perfil as UserRole
    });

    return {
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil
      }
    };
  }
};
