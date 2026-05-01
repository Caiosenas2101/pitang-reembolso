import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { httpErrorName } from "../utils/httpErrorName";

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      statusCode: error.statusCode,
      error: error.error
    });
  }

  console.error(error);

  return res.status(500).json({
    message: "Erro inesperado no servidor",
    statusCode: 500,
    error: httpErrorName(500)
  });
}
