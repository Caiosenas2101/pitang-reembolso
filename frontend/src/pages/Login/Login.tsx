import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage } from "../../components/Feedback";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../contexts/AuthContext";
import { getApiErrorMessage } from "../../services/api";
import pitangSymbol from "../../assets/pitang-symbol.png";

function PitangMark() {
  return (
    <img
      alt="Símbolo da Pitang"
      className="h-14 w-20 object-contain mix-blend-multiply"
      src={pitangSymbol}
    />
  );
}

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, senha);
      navigate("/reimbursements");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#140909] px-4 py-10 text-[#301413] sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#5b1816_0%,transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.06)_0_1px,transparent_1px)] bg-[length:auto,28px_28px]" />
      <div className="absolute left-1/2 top-[-18rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[#f01824]/20 blur-3xl" />
      <div className="absolute bottom-[-18rem] right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-[#ff6a5f]/15 blur-3xl" />

      <div className="relative w-full max-w-[430px]">
        <Card className="relative w-full overflow-hidden border-white/10 bg-white/[0.96] shadow-2xl shadow-[#f01824]/20 backdrop-blur">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#f01824] via-[#ff6a5f] to-[#f01824]" />
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full border border-[#f01824]/20" />
          <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full border border-[#f01824]/10" />
          <div className="absolute right-6 top-6 z-10 drop-shadow-[0_12px_22px_rgba(240,24,36,0.16)]">
            <PitangMark />
          </div>

          <CardHeader className="relative space-y-7 p-7 pb-5 sm:p-8 sm:pb-5">
            <div className="max-w-[250px]">
              <p className="text-5xl font-semibold leading-none tracking-normal text-[#f01824]">pitang</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.28em] text-[#8f5854]">Agile IT</p>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl text-[#301413]">Entrar</CardTitle>
              <p className="text-sm leading-6 text-[#80514d]">
                Acesse sua conta para continuar.
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-7 pt-0 sm:p-8 sm:pt-0">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && <ErrorMessage message={error} />}
              <div className="space-y-2">
                <Label className="text-[#4b201d]" htmlFor="email">
                  E-mail
                </Label>
                <Input
                  className="h-12 border-[#efc7c0] bg-[#fffaf9] text-[#371514] shadow-sm transition-colors focus-visible:border-[#f01824] focus-visible:ring-[#f01824]"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#4b201d]" htmlFor="senha">
                  Senha
                </Label>
                <Input
                  className="h-12 border-[#efc7c0] bg-[#fffaf9] text-[#371514] shadow-sm transition-colors focus-visible:border-[#f01824] focus-visible:ring-[#f01824]"
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  required
                />
              </div>
              <Button
                className="h-12 w-full gap-2 bg-[#f01824] text-white shadow-lg shadow-[#f01824]/25 hover:bg-[#d91520] focus-visible:ring-[#f01824]"
                type="submit"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
                {!loading && <ArrowRight aria-hidden="true" className="h-4 w-4" />}
              </Button>
              <Link
                className="block text-center text-sm font-medium text-[#c2262f] underline-offset-4 hover:underline"
                to="/register"
              >
                Criar conta
              </Link>
            </form>
        </CardContent>
      </Card>
      </div>
    </main>
  );
}
