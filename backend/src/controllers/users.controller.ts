import { Request, Response } from "express";
import { usersService } from "../services/users.service";

export const usersController = {
  async create(req: Request, res: Response) {
    const user = await usersService.create(req.body);
    return res.status(201).json(user);
  },

  async list(_req: Request, res: Response) {
    const users = await usersService.list();
    return res.json(users);
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params as { id: string };

    await usersService.delete(id, req.user!.id);
    return res.status(204).send();
  }
};
