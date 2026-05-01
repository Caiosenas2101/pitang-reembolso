import { ReimbursementStatus } from "../types/reimbursement";
import { Badge } from "./ui/badge";

const styles: Record<ReimbursementStatus, Parameters<typeof Badge>[0]["variant"]> = {
  RASCUNHO: "secondary",
  ENVIADO: "default",
  APROVADO: "success",
  REJEITADO: "destructive",
  PAGO: "warning",
  CANCELADO: "secondary"
};

export function StatusBadge({ status }: { status: ReimbursementStatus }) {
  return <Badge variant={styles[status]}>{status}</Badge>;
}
