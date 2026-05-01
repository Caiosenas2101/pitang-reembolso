import { NextFunction, Request, Response } from "express";

export function asyncHandler<P = Record<string, string>>(
  handler: (req: Request<P>, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request<P>, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
