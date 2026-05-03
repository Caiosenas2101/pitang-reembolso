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
import pitangSymbol from "../../assets/pitang-symbol.png";

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
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#140909] px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#5b1816_0%,transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.06)_0_1px,transparent_1px)] bg-[length:auto,28px_28px]" />
      <div className="absolute left-1/2 top-[-18rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[#f01824]/20 blur-3xl" />
      <Card className="relative w-full max-w-md overflow-hidden border-white/10 bg-white/[0.96] shadow-2xl shadow-[#f01824]/20">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#f01824] via-[#ff6a5f] to-[#f01824]" />
        <div className="absolute right-6 top-6">
          <img className="h-14 w-20 object-contain mix-blend-multiply" src={pitangSymbol} alt="Símbolo da Pitang" />
        </div>
        <CardHeader className="space-y-6 p-7 pb-4 sm:p-8 sm:pb-5">
          <div>
            <p className="text-5xl font-semibold leading-none tracking-normal text-[#f01824]">pitang</p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.28em] text-[#8f5854]">Agile IT</p>
          </div>
          <CardTitle className="text-3xl text-[#301413]">Cadastro</CardTitle>
        </CardHeader>
        <CardContent className="p-7 pt-0 sm:p-8 sm:pt-0">
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
        <Link className="block text-center text-sm font-medium text-[#c2262f] underline-offset-4 hover:underline" to="/login">
          Voltar para login
        </Link>
      </form>
        </CardContent>
      </Card>
    </main>
  );
}
