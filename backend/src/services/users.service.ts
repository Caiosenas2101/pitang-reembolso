import { UserRole } from "../constants/enums";
import { AppError } from "../errors/AppError";
import { usersRepository } from "../repositories/users.repository";
import { hashPassword } from "../utils/password";

export const usersService = {
  async create(data: { nome: string; email: string; senha: string; perfil: UserRole }) {
    if (data.perfil === UserRole.ADMIN) {
      throw new AppError("Não é permitido criar usuário administrador", 400, "Bad Request");
    }

    const existingUser = await usersRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError("E-mail já cadastrado", 400, "Bad Request");
    }

    const user = await usersRepository.create({
      ...data,
      senha: await hashPassword(data.senha)
    });

    const { senha: _senha, ...safeUser } = user;
    return safeUser;
  },

  list() {
    return usersRepository.list();
  },

  async delete(id: string, currentUserId: string) {
    if (id === currentUserId) {
      throw new AppError("Não é permitido apagar a própria conta", 400, "Bad Request");
    }

    const user = await usersRepository.findById(id);

    if (!user) {
      throw new AppError("Usuário não encontrado", 404, "Not Found");
    }

    if (user.perfil === UserRole.ADMIN) {
      throw new AppError("Não é permitido apagar usuário administrador", 400, "Bad Request");
    }

    try {
      await usersRepository.delete(id);
    } catch {
      throw new AppError(
        "Não foi possível apagar usuário com registros vinculados",
        400,
        "Bad Request"
      );
    }
  }
};
