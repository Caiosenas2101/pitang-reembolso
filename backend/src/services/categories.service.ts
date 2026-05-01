import { AppError } from "../errors/AppError";
import { categoriesRepository } from "../repositories/categories.repository";

export const categoriesService = {
  create(data: { nome: string; ativo?: boolean }) {
    return categoriesRepository.create(data);
  },

  list() {
    return categoriesRepository.list();
  },

  async update(id: string, data: { nome?: string; ativo?: boolean }) {
    const category = await categoriesRepository.findById(id);

    if (!category) {
      throw new AppError("Categoria não encontrada", 404, "Not Found");
    }

    return categoriesRepository.update(id, data);
  },

  async ensureActive(id: string) {
    const category = await categoriesRepository.findById(id);

    if (!category || !category.ativo) {
      throw new AppError("Categoria não encontrada ou inativa", 400, "Bad Request");
    }

    return category;
  }
};
