import { Request, Response } from "express";
import { attachmentsService } from "../services/attachments.service";

type IdParams = { id: string };

function getUser(req: Request) {
  return req.user!;
}

export const attachmentsController = {
  async create(req: Request<IdParams>, res: Response) {
    const attachment = await attachmentsService.create(getUser(req), req.params.id, req.body);
    return res.status(201).json(attachment);
  },

  async list(req: Request<IdParams>, res: Response) {
    const attachments = await attachmentsService.list(getUser(req), req.params.id);
    return res.json(attachments);
  }
};
