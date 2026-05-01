import { Request, Response } from "express";
import { reimbursementsService } from "../services/reimbursements.service";

type IdParams = { id: string };

function getUser(req: Request) {
  return req.user!;
}

export const reimbursementsController = {
  async create(req: Request, res: Response) {
    const reimbursement = await reimbursementsService.create(getUser(req), req.body);
    return res.status(201).json(reimbursement);
  },

  async list(req: Request, res: Response) {
    const reimbursements = await reimbursementsService.list(getUser(req), req.query);
    return res.json(reimbursements);
  },

  async findById(req: Request<IdParams>, res: Response) {
    const reimbursement = await reimbursementsService.findById(getUser(req), req.params.id);
    return res.json(reimbursement);
  },

  async update(req: Request<IdParams>, res: Response) {
    const reimbursement = await reimbursementsService.update(getUser(req), req.params.id, req.body);
    return res.json(reimbursement);
  },

  async submit(req: Request<IdParams>, res: Response) {
    const reimbursement = await reimbursementsService.submit(getUser(req), req.params.id);
    return res.json(reimbursement);
  },

  async approve(req: Request<IdParams>, res: Response) {
    const reimbursement = await reimbursementsService.approve(getUser(req), req.params.id);
    return res.json(reimbursement);
  },

  async reject(req: Request<IdParams>, res: Response) {
    const reimbursement = await reimbursementsService.reject(
      getUser(req),
      req.params.id,
      req.body.justificativaRejeicao
    );
    return res.json(reimbursement);
  },

  async pay(req: Request<IdParams>, res: Response) {
    const reimbursement = await reimbursementsService.pay(getUser(req), req.params.id);
    return res.json(reimbursement);
  },

  async cancel(req: Request<IdParams>, res: Response) {
    const reimbursement = await reimbursementsService.cancel(getUser(req), req.params.id);
    return res.json(reimbursement);
  },

  async history(req: Request<IdParams>, res: Response) {
    const history = await reimbursementsService.listHistory(getUser(req), req.params.id);
    return res.json(history);
  }
};
