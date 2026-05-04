import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState, ErrorMessage, Loading } from "../../components/Feedback";
import { StatusBadge } from "../../components/StatusBadge";
import { Button, buttonVariants } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
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
type SortOption = "dataDespesa:desc" | "dataDespesa:asc" | "valor:desc" | "valor:asc";

type AppliedFilters = {
  status: string;
  categoriaId: string;
  colaborador: string;
  sortBy: "dataDespesa" | "valor";
  sortOrder: "asc" | "desc";
};

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Data mais recente", value: "dataDespesa:desc" },
  { label: "Data mais antiga", value: "dataDespesa:asc" },
  { label: "Maior valor", value: "valor:desc" },
  { label: "Menor valor", value: "valor:asc" }
];

const defaultAppliedFilters: AppliedFilters = {
  status: "",
  categoriaId: "",
  colaborador: "",
  sortBy: "dataDespesa",
  sortOrder: "desc"
};

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function applyReimbursementFilters(items: Reimbursement[], filters: AppliedFilters) {
  const collaboratorSearch = normalizeSearch(filters.colaborador);

  return [...items]
    .filter((item) => {
      if (filters.status && item.status !== filters.status) return false;
      if (filters.categoriaId && item.categoriaId !== filters.categoriaId) return false;

      if (collaboratorSearch) {
        const requesterName = normalizeSearch(item.solicitante?.nome ?? "");
        const requesterEmail = normalizeSearch(item.solicitante?.email ?? "");

        if (!requesterName.includes(collaboratorSearch) && !requesterEmail.includes(collaboratorSearch)) {
          return false;
        }
      }

      return true;
    })
    .sort((first, second) => {
      const direction = filters.sortOrder === "asc" ? 1 : -1;

      if (filters.sortBy === "valor") {
        return (Number(first.valor) - Number(second.valor)) * direction;
      }

      return (new Date(first.dataDespesa).getTime() - new Date(second.dataDespesa).getTime()) * direction;
    });
}

export function Dashboard() {
  const { user } = useAuth();
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [colaborador, setColaborador] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("dataDespesa:desc");
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>(defaultAppliedFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReimbursements = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const data = await listReimbursements({
        ...(appliedFilters.status ? { status: appliedFilters.status } : {}),
        ...(appliedFilters.categoriaId ? { categoriaId: appliedFilters.categoriaId } : {}),
        ...(appliedFilters.colaborador ? { colaborador: appliedFilters.colaborador } : {}),
        sortBy: appliedFilters.sortBy,
        sortOrder: appliedFilters.sortOrder
      });

      setReimbursements(applyReimbursementFilters(data, appliedFilters));
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

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
    setColaborador("");
    setSortOption("dataDespesa:desc");
    setAppliedFilters(defaultAppliedFilters);
  }

  function applyFilters() {
    const [sortBy, sortOrder] = sortOption.split(":") as ["dataDespesa" | "valor", "asc" | "desc"];

    setAppliedFilters({
      status,
      categoriaId,
      colaborador: colaborador.trim(),
      sortBy,
      sortOrder
    });
  }

  if (loading && categories.length === 0) return <Loading />;

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Solicitações</h1>
          <p className="text-sm text-white/55">Listagem conforme o perfil do usuário logado.</p>
        </div>
        {user?.perfil === "COLABORADOR" && (
          <Link className={buttonVariants()} to="/reimbursements/new">Nova solicitação</Link>
        )}
      </div>

      {error && <ErrorMessage message={error} />}
      <Card className="mb-4">
        <CardContent className="grid gap-4 p-4 md:grid-cols-[1.2fr_1fr_1fr_1fr_auto_auto]">
          <div className="space-y-2">
            <Label htmlFor="colaborador">Colaborador</Label>
            <Input
              id="colaborador"
              value={colaborador}
              onChange={(event) => setColaborador(event.target.value)}
              placeholder="Nome ou e-mail"
            />
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="sortOption">Ordenação</Label>
            <Select
              id="sortOption"
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value as SortOption)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-end">
            <Button type="button" onClick={applyFilters}>
              Aplicar filtros
            </Button>
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
