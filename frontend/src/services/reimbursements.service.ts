import {
  Attachment,
  Reimbursement,
  ReimbursementHistory
} from "../types/reimbursement";
import { api } from "./api";

type ListReimbursementsFilters = {
  status?: string;
  categoriaId?: string;
  sortBy?: "dataDespesa" | "valor";
  sortOrder?: "asc" | "desc";
};

export async function listReimbursements(filters: ListReimbursementsFilters = {}) {
  const response = await api.get<Reimbursement[]>("/reimbursements", {
    params: filters
  });
  return response.data;
}

export async function getReimbursement(id: string) {
  const response = await api.get<Reimbursement>(`/reimbursements/${id}`);
  return response.data;
}

export async function createReimbursement(data: {
  categoriaId: string;
  descricao: string;
  valor: number;
  dataDespesa: string;
}) {
  const response = await api.post<Reimbursement>("/reimbursements", data);
  return response.data;
}

export async function updateReimbursement(
  id: string,
  data: {
    categoriaId?: string;
    descricao?: string;
    valor?: number;
    dataDespesa?: string;
  }
) {
  const response = await api.put<Reimbursement>(`/reimbursements/${id}`, data);
  return response.data;
}

export async function submitReimbursement(id: string) {
  const response = await api.post<Reimbursement>(`/reimbursements/${id}/submit`);
  return response.data;
}

export async function approveReimbursement(id: string) {
  const response = await api.post<Reimbursement>(`/reimbursements/${id}/approve`);
  return response.data;
}

export async function rejectReimbursement(id: string, justificativaRejeicao: string) {
  const response = await api.post<Reimbursement>(`/reimbursements/${id}/reject`, {
    justificativaRejeicao
  });
  return response.data;
}

export async function payReimbursement(id: string) {
  const response = await api.post<Reimbursement>(`/reimbursements/${id}/pay`);
  return response.data;
}

export async function cancelReimbursement(id: string) {
  const response = await api.post<Reimbursement>(`/reimbursements/${id}/cancel`);
  return response.data;
}

export async function listHistory(id: string) {
  const response = await api.get<ReimbursementHistory[]>(`/reimbursements/${id}/history`);
  return response.data;
}

export async function createAttachment(
  id: string,
  data: { nomeArquivo: string; urlArquivo: string; tipoArquivo: string }
) {
  const response = await api.post<Attachment>(`/reimbursements/${id}/attachments`, data);
  return response.data;
}
