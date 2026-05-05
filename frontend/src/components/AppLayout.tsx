import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import pitangSymbol from "../assets/pitang-symbol.png";
import { Button } from "./ui/button";

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#140909] text-[#301413]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,#5b1816_0%,transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.06)_0_1px,transparent_1px)] bg-[length:auto,28px_28px]" />
      <div className="pointer-events-none absolute right-[-12rem] top-[-12rem] h-[32rem] w-[32rem] rounded-full bg-[#f01824]/20 blur-3xl" />
      <nav className="relative border-b border-white/10 bg-[#1a0b0b]/85 text-white shadow-2xl shadow-[#f01824]/10 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <Link className="flex items-center gap-3" to="/reimbursements">
            <img className="h-9 w-12 object-contain mix-blend-screen" src={pitangSymbol} alt="Símbolo da Pitang" />
            <span>
              <span className="block text-lg font-semibold leading-none text-[#f01824]">pitang</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">Agile IT</span>
            </span>
          </Link>
          <div className="flex items-center gap-7">
            <div className="flex items-center gap-4">
              <NavLink className="rounded-md px-3 py-2 text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white" to="/reimbursements">
                Solicitações
              </NavLink>
              {user?.perfil === "COLABORADOR" && (
                <NavLink className="rounded-md px-3 py-2 text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white" to="/reimbursements/new">
                  Nova
                </NavLink>
              )}
              {user?.perfil === "ADMIN" && (
                <>
                  <NavLink className="rounded-md px-3 py-2 text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white" to="/users">
                    Contas
                  </NavLink>
                  <NavLink className="rounded-md px-3 py-2 text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white" to="/categories">
                    Categorias
                  </NavLink>
                </>
              )}
            </div>
            <span className="hidden text-sm text-white/55 md:inline">
              {user?.nome} · {user?.perfil}
            </span>
            <Button className="border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white" variant="outline" size="sm" type="button" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </nav>
      <main className="relative mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
