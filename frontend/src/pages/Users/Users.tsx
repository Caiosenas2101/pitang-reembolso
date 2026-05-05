import { FormEvent, useEffect, useState } from "react";
import { ErrorMessage, Loading, SuccessMessage } from "../../components/Feedback";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select } from "../../components/ui/select";
import { Table, TBody, TD, TH, THead, TR } from "../../components/ui/table";
import { useAuth } from "../../contexts/AuthContext";
import { getApiErrorMessage } from "../../services/api";
import { createUser, deleteUser, listUsers } from "../../services/users.service";
import { User, UserRole } from "../../types/user";
import { formatDateTime } from "../../utils/format";

type CreatableRole = Exclude<UserRole, "ADMIN">;

const roles: CreatableRole[] = ["COLABORADOR", "GESTOR", "FINANCEIRO"];

export function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState<CreatableRole | "">("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setUsers(await listUsers());
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

    if (!perfil) {
      setError("Perfil é obrigatório");
      return;
    }

    setSaving(true);

    try {
      await createUser({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        perfil
      });
      setNome("");
      setEmail("");
      setSenha("");
      setPerfil("");
      await load();
      setSuccess("Conta criada com sucesso");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(account: User) {
    setError("");
    setSuccess("");
    setDeletingId(account.id);

    try {
      await deleteUser(account.id);
      await load();
      setSuccess("Conta apagada com sucesso");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <Loading />;

  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold text-white">Contas</h1>
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Nova conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1fr_1fr_0.9fr_0.8fr_auto]" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                minLength={2}
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                minLength={6}
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="perfil">Perfil</Label>
              <Select
                id="perfil"
                value={perfil}
                onChange={(event) => setPerfil(event.target.value as CreatableRole | "")}
                required
              >
                <option value="">Selecione</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full" type="submit" disabled={saving}>
                {saving ? "Criando..." : "Criar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <THead>
              <TR>
                <TH>Nome</TH>
                <TH>E-mail</TH>
                <TH>Perfil</TH>
                <TH>Criada em</TH>
                <TH className="text-right">Ações</TH>
              </TR>
            </THead>
            <TBody>
              {users.map((account) => {
                const canDelete =
                  account.perfil !== "ADMIN" && account.id !== currentUser?.id;

                return (
                  <TR key={account.id}>
                    <TD>{account.nome}</TD>
                    <TD>{account.email}</TD>
                    <TD>{account.perfil}</TD>
                    <TD>{account.criadoEm ? formatDateTime(account.criadoEm) : "-"}</TD>
                    <TD className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        disabled={!canDelete || deletingId === account.id}
                        onClick={() => handleDelete(account)}
                      >
                        {deletingId === account.id ? "Apagando..." : "Apagar"}
                      </Button>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
