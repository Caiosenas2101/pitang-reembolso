import { api } from "./api";
import { User } from "../types/user";

type LoginResponse = {
  token: string;
  user: User;
};

export async function loginRequest(email: string, senha: string) {
  const response = await api.post<LoginResponse>("/auth/login", { email, senha });
  return response.data;
}

export async function registerRequest(data: {
  nome: string;
  email: string;
  senha: string;
  perfil: string;
}) {
  const response = await api.post<User>("/users", data);
  return response.data;
}
