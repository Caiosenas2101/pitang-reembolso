import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const authController = {
  async login(req: Request, res: Response) {
    const result = await authService.login(req.body.email, req.body.senha);
    return res.json(result);
  }
};
