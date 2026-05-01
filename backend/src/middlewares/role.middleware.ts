import { UserRole } from "../constants/enums";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

export function roleMiddleware(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Usuário não autenticado", 401, "Unauthorized");
    }

    if (!roles.includes(req.user.perfil)) {
      throw new AppError("Usuário sem permissão para executar esta ação", 403, "Forbidden");
    }

    return next();
  };
}
