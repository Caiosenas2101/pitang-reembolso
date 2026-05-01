import { Router } from "express";
import { attachmentsRoutes } from "./attachments.routes";
import { authRoutes } from "./auth.routes";
import { categoriesRoutes } from "./categories.routes";
import { reimbursementsRoutes } from "./reimbursements.routes";
import { usersRoutes } from "./users.routes";

export const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", usersRoutes);
routes.use("/categories", categoriesRoutes);
routes.use("/reimbursements", reimbursementsRoutes);
routes.use("/reimbursements/:id/attachments", attachmentsRoutes);
