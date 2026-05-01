import { Category } from "../types/category";
import { api } from "./api";

export async function listCategories() {
  const response = await api.get<Category[]>("/categories");
  return response.data;
}

export async function createCategory(data: { nome: string; ativo: boolean }) {
  const response = await api.post<Category>("/categories", data);
  return response.data;
}

export async function updateCategory(id: string, data: { nome?: string; ativo?: boolean }) {
  const response = await api.put<Category>(`/categories/${id}`, data);
  return response.data;
}
