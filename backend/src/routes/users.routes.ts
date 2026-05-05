import { UserRole } from "../constants/enums";
import { Router } from "express";
import { usersController } from "../controllers/users.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { idParamSchema } from "../schemas/common.schema";
import { createUserSchema } from "../schemas/users.schema";
import { asyncHandler } from "../utils/asyncHandler";

export const usersRoutes = Router();

usersRoutes.post(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  validate({ body: createUserSchema }),
  asyncHandler(usersController.create)
);
usersRoutes.get(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  asyncHandler(usersController.list)
);
usersRoutes.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  validate({ params: idParamSchema }),
  asyncHandler(usersController.delete)
);
