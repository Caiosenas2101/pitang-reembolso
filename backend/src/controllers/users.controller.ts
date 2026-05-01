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
  }
};
