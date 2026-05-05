import { User, UserRole } from "../types/user";
import { api } from "./api";

export type CreateUserPayload = {
  nome: string;
  email: string;
  senha: string;
  perfil: Exclude<UserRole, "ADMIN">;
};

export async function listUsers() {
  const response = await api.get<User[]>("/users");
  return response.data;
}

export async function createUser(data: CreateUserPayload) {
  const response = await api.post<User>("/users", data);
  return response.data;
}

export async function deleteUser(id: string) {
  await api.delete(`/users/${id}`);
}
