import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState, ErrorMessage, Loading } from "../../components/Feedback";
import { StatusBadge } from "../../components/StatusBadge";
import { Button, buttonVariants } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "../../components/ui/table";
import { useAuth } from "../../contexts/AuthContext";
import { getApiErrorMessage } from "../../services/api";
import { listReimbursements } from "../../services/reimbursements.service";
import { Reimbursement } from "../../types/reimbursement";
import { formatCurrency, formatDate } from "../../utils/format";

export function Dashboard() {
  const { user } = useAuth();
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setReimbursements(await listReimbursements());
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <Loading />;

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Solicitações</h1>
          <p className="text-sm text-muted-foreground">Listagem conforme o perfil do usuário logado.</p>
        </div>
        {user?.perfil === "COLABORADOR" && (
          <Link className={buttonVariants()} to="/reimbursements/new">Nova solicitação</Link>
        )}
      </div>

      {error && <ErrorMessage message={error} />}
      {!error && reimbursements.length === 0 && (
        <EmptyState message="Nenhuma solicitação encontrada." />
      )}

      {reimbursements.length > 0 && (
        <Card>
          <CardContent className="p-0">
          <Table>
            <THead>
              <TR>
                <TH>Descrição</TH>
                <TH>Categoria</TH>
                <TH>Valor</TH>
                <TH>Data</TH>
                <TH>Status</TH>
                <TH>Solicitante</TH>
                <TH></TH>
              </TR>
            </THead>
            <TBody>
              {reimbursements.map((item) => (
                <TR key={item.id}>
                  <TD>{item.descricao}</TD>
                  <TD>{item.categoria?.nome ?? "-"}</TD>
                  <TD>{formatCurrency(item.valor)}</TD>
                  <TD>{formatDate(item.dataDespesa)}</TD>
                  <TD>
                    <StatusBadge status={item.status} />
                  </TD>
                  <TD>{item.solicitante?.nome ?? "-"}</TD>
                  <TD className="text-right">
                    <Link className={buttonVariants({ variant: "outline", size: "sm" })} to={`/reimbursements/${item.id}`}>Detalhar</Link>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
