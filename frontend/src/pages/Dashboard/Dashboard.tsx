import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState, ErrorMessage, Loading } from "../../components/Feedback";
import { StatusBadge } from "../../components/StatusBadge";
import { Button, buttonVariants } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Select } from "../../components/ui/select";
import { Table, TBody, TD, TH, THead, TR } from "../../components/ui/table";
import { useAuth } from "../../contexts/AuthContext";
import { getApiErrorMessage } from "../../services/api";
import { listCategories } from "../../services/categories.service";
import { listReimbursements } from "../../services/reimbursements.service";
import { Category } from "../../types/category";
import { Reimbursement } from "../../types/reimbursement";
import { formatCurrency, formatDate } from "../../utils/format";

const statuses = ["RASCUNHO", "ENVIADO", "APROVADO", "REJEITADO", "PAGO", "CANCELADO"];

export function Dashboard() {
  const { user } = useAuth();
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReimbursements = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      setReimbursements(
        await listReimbursements({
          ...(status ? { status } : {}),
          ...(categoriaId ? { categoriaId } : {})
        })
      );
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [categoriaId, status]);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [categoriesData] = await Promise.all([listCategories(), loadReimbursements()]);
        setCategories(categoriesData);
      } catch (err) {
        setError(getApiErrorMessage(err));
        setLoading(false);
      }
    }

    loadInitialData();
  }, [loadReimbursements]);

  function clearFilters() {
    setStatus("");
    setCategoriaId("");
  }

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
      <Card className="mb-4">
        <CardContent className="grid gap-4 p-4 md:grid-cols-[1fr_1fr_auto]">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select id="status" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">Todos</option>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoriaId">Categoria</Label>
            <Select
              id="categoriaId"
              value={categoriaId}
              onChange={(event) => setCategoriaId(event.target.value)}
            >
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nome}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-end">
            <Button variant="outline" type="button" onClick={clearFilters}>
              Limpar filtros
            </Button>
          </div>
        </CardContent>
      </Card>
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
