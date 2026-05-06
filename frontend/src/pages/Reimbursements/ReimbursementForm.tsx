import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "../../components/Feedback";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { getApiErrorMessage } from "../../services/api";
import { listCategories } from "../../services/categories.service";
import {
  createReimbursement,
  updateReimbursement
} from "../../services/reimbursements.service";
import { Category } from "../../types/category";
import { Reimbursement } from "../../types/reimbursement";

type Props = {
  reimbursement?: Reimbursement;
};

function getTodayInputValue() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${today.getFullYear()}-${month}-${day}`;
}

export function ReimbursementForm({ reimbursement }: Props) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriaId, setCategoriaId] = useState(reimbursement?.categoriaId ?? "");
  const [descricao, setDescricao] = useState(reimbursement?.descricao ?? "");
  const [valor, setValor] = useState(String(reimbursement?.valor ?? ""));
  const [dataDespesa, setDataDespesa] = useState(
    reimbursement?.dataDespesa ? reimbursement.dataDespesa.slice(0, 10) : ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await listCategories();
        setCategories(data.filter((category) => category.ativo));
      } catch (err) {
        setError(getApiErrorMessage(err));
      }
    }

    loadCategories();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        categoriaId,
        descricao,
        valor: Number(valor),
        dataDespesa
      };

      const saved = reimbursement
        ? await updateReimbursement(reimbursement.id, payload)
        : await createReimbursement(payload);

      navigate(`/reimbursements/${saved.id}`);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && <ErrorMessage message={error} />}
      <div className="space-y-2">
        <Label htmlFor="categoriaId">
          Categoria
        </Label>
        <Select
          id="categoriaId"
          value={categoriaId}
          onChange={(event) => setCategoriaId(event.target.value)}
          required
        >
          <option value="">Selecione</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nome}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="descricao">
          Descrição
        </Label>
        <Textarea
          id="descricao"
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          required
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="valor">
            Valor
          </Label>
          <Input
            id="valor"
            type="number"
            min="0.01"
            step="0.01"
            value={valor}
            onChange={(event) => setValor(event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dataDespesa">
            Data da despesa
          </Label>
          <Input
            id="dataDespesa"
            type="date"
            max={getTodayInputValue()}
            value={dataDespesa}
            onChange={(event) => setDataDespesa(event.target.value)}
            required
          />
        </div>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
