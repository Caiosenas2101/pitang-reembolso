import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage, SuccessMessage } from "../../components/Feedback";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select } from "../../components/ui/select";
import { getApiErrorMessage } from "../../services/api";
import { registerRequest } from "../../services/auth.service";
import { UserRole } from "../../types/user";

const roles: UserRole[] = ["COLABORADOR", "GESTOR", "FINANCEIRO", "ADMIN"];

export function Register() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState<UserRole>("COLABORADOR");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await registerRequest({ nome, email, senha, perfil });
      setSuccess("Usuário cadastrado com sucesso");
      setTimeout(() => navigate("/login"), 600);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
        </CardHeader>
        <CardContent>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}
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
        <div className="space-y-2">
          <Label htmlFor="email">
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="senha">
            Senha
          </Label>
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
          <Label htmlFor="perfil">
            Perfil
          </Label>
          <Select
            id="perfil"
            value={perfil}
            onChange={(event) => setPerfil(event.target.value as UserRole)}
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </Select>
        </div>
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>
        <Link className="block text-sm text-muted-foreground underline" to="/login">
          Voltar para login
        </Link>
      </form>
        </CardContent>
      </Card>
    </main>
  );
}
