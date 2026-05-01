import { FormEvent, useEffect, useState } from "react";
import { ErrorMessage, Loading, SuccessMessage } from "../../components/Feedback";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Table, TBody, TD, TH, THead, TR } from "../../components/ui/table";
import { getApiErrorMessage } from "../../services/api";
import {
  createCategory,
  listCategories,
  updateCategory
} from "../../services/categories.service";
import { Category } from "../../types/category";

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [nome, setNome] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setCategories(await listCategories());
  }

  useEffect(() => {
    async function loadPage() {
      try {
        await load();
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      await createCategory({ nome, ativo: true });
      setNome("");
      await load();
      setSuccess("Categoria criada com sucesso");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  async function toggleCategory(category: Category) {
    setError("");
    setSuccess("");

    try {
      await updateCategory(category.id, { ativo: !category.ativo });
      await load();
      setSuccess("Categoria atualizada com sucesso");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  function startRename(category: Category) {
    setError("");
    setSuccess("");
    setEditingId(category.id);
    setEditNome(category.nome);
  }

  function cancelRename() {
    setEditingId(null);
    setEditNome("");
  }

  async function saveRename(categoryId: string) {
    const trimmed = editNome.trim();
    if (trimmed.length < 2) {
      setError("Nome da categoria deve ter pelo menos 2 caracteres");
      return;
    }

    setError("");
    setSuccess("");

    try {
      await updateCategory(categoryId, { nome: trimmed });
      cancelRename();
      await load();
      setSuccess("Nome da categoria atualizado");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  if (loading) return <Loading />;

  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold">Categorias</h1>
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      <form className="mb-6 grid gap-3 md:grid-cols-[1fr_auto]" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="nome">
            Nome
          </Label>
          <Input
            id="nome"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            required
          />
        </div>
        <div className="flex items-end">
          <Button type="submit">
            Criar categoria
          </Button>
        </div>
      </form>

      <Card>
        <CardContent className="p-0">
        <Table>
          <THead>
            <TR>
              <TH>Nome</TH>
              <TH>Status</TH>
              <TH className="text-right">Ações</TH>
            </TR>
          </THead>
          <TBody>
            {categories.map((category) => (
              <TR key={category.id}>
                <TD>
                  {editingId === category.id ? (
                    <Input
                      aria-label={`Novo nome para ${category.nome}`}
                      value={editNome}
                      onChange={(event) => setEditNome(event.target.value)}
                      required
                      minLength={2}
                    />
                  ) : (
                    category.nome
                  )}
                </TD>
                <TD>{category.ativo ? "Ativa" : "Inativa"}</TD>
                <TD className="text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    {editingId === category.id ? (
                      <>
                        <Button
                          size="sm"
                          type="button"
                          onClick={() => saveRename(category.id)}
                        >
                          Salvar nome
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={cancelRename}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          disabled={editingId !== null && editingId !== category.id}
                          onClick={() => startRename(category)}
                        >
                          Renomear
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          disabled={editingId !== null}
                          onClick={() => toggleCategory(category)}
                        >
                          {category.ativo ? "Inativar" : "Ativar"}
                        </Button>
                      </>
                    )}
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
        </CardContent>
      </Card>
    </section>
  );
}
