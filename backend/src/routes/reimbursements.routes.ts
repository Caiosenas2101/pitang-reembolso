import { UserRole } from "../constants/enums";
import { Router } from "express";
import { reimbursementsController } from "../controllers/reimbursements.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { idParamSchema } from "../schemas/common.schema";
import {
  createReimbursementSchema,
  listReimbursementsQuerySchema,
  rejectReimbursementSchema,
  updateReimbursementSchema
} from "../schemas/reimbursements.schema";
import { asyncHandler } from "../utils/asyncHandler";

export const reimbursementsRoutes = Router();

reimbursementsRoutes.use(authMiddleware);

reimbursementsRoutes.get(
  "/",
  validate({ query: listReimbursementsQuerySchema }),
  asyncHandler(reimbursementsController.list)
);
reimbursementsRoutes.post(
  "/",
  roleMiddleware(UserRole.COLABORADOR),
  validate({ body: createReimbursementSchema }),
  asyncHandler(reimbursementsController.create)
);
reimbursementsRoutes.get(
  "/:id",
  validate({ params: idParamSchema }),
  asyncHandler(reimbursementsController.findById)
);
reimbursementsRoutes.put(
  "/:id",
  roleMiddleware(UserRole.COLABORADOR),
  validate({ params: idParamSchema, body: updateReimbursementSchema }),
  asyncHandler(reimbursementsController.update)
);
reimbursementsRoutes.post(
  "/:id/submit",
  roleMiddleware(UserRole.COLABORADOR),
  validate({ params: idParamSchema }),
  asyncHandler(reimbursementsController.submit)
);
reimbursementsRoutes.post(
  "/:id/approve",
  roleMiddleware(UserRole.GESTOR),
  validate({ params: idParamSchema }),
  asyncHandler(reimbursementsController.approve)
);
reimbursementsRoutes.post(
  "/:id/reject",
  roleMiddleware(UserRole.GESTOR),
  validate({ params: idParamSchema, body: rejectReimbursementSchema }),
  asyncHandler(reimbursementsController.reject)
);
reimbursementsRoutes.post(
  "/:id/pay",
  roleMiddleware(UserRole.FINANCEIRO),
  validate({ params: idParamSchema }),
  asyncHandler(reimbursementsController.pay)
);
reimbursementsRoutes.post(
  "/:id/cancel",
  roleMiddleware(UserRole.COLABORADOR),
  validate({ params: idParamSchema }),
  asyncHandler(reimbursementsController.cancel)
);
reimbursementsRoutes.get(
  "/:id/history",
  validate({ params: idParamSchema }),
  asyncHandler(reimbursementsController.history)
);
