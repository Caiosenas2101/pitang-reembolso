import { Request, Response } from "express";
import { categoriesService } from "../services/categories.service";

type IdParams = { id: string };

export const categoriesController = {
  async create(req: Request, res: Response) {
    const category = await categoriesService.create(req.body);
    return res.status(201).json(category);
  },

  async list(_req: Request, res: Response) {
    const categories = await categoriesService.list();
    return res.json(categories);
  },

  async update(req: Request<IdParams>, res: Response) {
    const category = await categoriesService.update(req.params.id, req.body);
    return res.json(category);
  }
};
