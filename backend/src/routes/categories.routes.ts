import { UserRole } from "../constants/enums";
import { Router } from "express";
import { categoriesController } from "../controllers/categories.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createCategorySchema, updateCategorySchema } from "../schemas/categories.schema";
import { idParamSchema } from "../schemas/common.schema";
import { asyncHandler } from "../utils/asyncHandler";

export const categoriesRoutes = Router();

categoriesRoutes.get("/", authMiddleware, asyncHandler(categoriesController.list));
categoriesRoutes.post(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  validate({ body: createCategorySchema }),
  asyncHandler(categoriesController.create)
);
categoriesRoutes.put(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  validate({ params: idParamSchema, body: updateCategorySchema }),
  asyncHandler(categoriesController.update)
);
