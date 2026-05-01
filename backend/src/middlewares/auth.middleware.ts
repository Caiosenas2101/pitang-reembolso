import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { verifyToken } from "../utils/jwt";

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token JWT ausente", 401, "Unauthorized");
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    throw new AppError("Token JWT inválido", 401, "Unauthorized");
  }

  try {
    const payload = verifyToken(token);

    req.user = {
      id: payload.sub,
      email: payload.email,
      perfil: payload.perfil
    };

    return next();
  } catch {
    throw new AppError("Token JWT inválido ou expirado", 401, "Unauthorized");
  }
}
