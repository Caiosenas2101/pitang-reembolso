import { UserRole } from "../constants/enums";
import { AppError } from "../errors/AppError";
import { usersRepository } from "../repositories/users.repository";
import { hashPassword } from "../utils/password";

export const usersService = {
  async create(data: { nome: string; email: string; senha: string; perfil: UserRole }) {
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
  }
};
