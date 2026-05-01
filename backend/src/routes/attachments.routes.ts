import { UserRole } from "../constants/enums";
import { Router } from "express";
import { attachmentsController } from "../controllers/attachments.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createAttachmentSchema } from "../schemas/attachments.schema";
import { idParamSchema } from "../schemas/common.schema";
import { asyncHandler } from "../utils/asyncHandler";

export const attachmentsRoutes = Router({ mergeParams: true });

attachmentsRoutes.use(authMiddleware);

attachmentsRoutes.post(
  "/",
  roleMiddleware(UserRole.COLABORADOR),
  validate({ params: idParamSchema, body: createAttachmentSchema }),
  asyncHandler(attachmentsController.create)
);
attachmentsRoutes.get(
  "/",
  validate({ params: idParamSchema }),
  asyncHandler(attachmentsController.list)
);
