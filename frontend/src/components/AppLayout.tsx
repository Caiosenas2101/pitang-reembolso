import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link className="text-lg font-semibold" to="/reimbursements">
            Reembolsos
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <NavLink className="text-sm text-muted-foreground hover:text-foreground" to="/reimbursements">
                Solicitações
              </NavLink>
              {user?.perfil === "COLABORADOR" && (
                <NavLink className="text-sm text-muted-foreground hover:text-foreground" to="/reimbursements/new">
                  Nova
                </NavLink>
              )}
              {user?.perfil === "ADMIN" && (
                <NavLink className="text-sm text-muted-foreground hover:text-foreground" to="/categories">
                  Categorias
                </NavLink>
              )}
            </div>
            <span className="hidden text-sm text-muted-foreground md:inline">
              {user?.nome} · {user?.perfil}
            </span>
            <Button variant="outline" size="sm" type="button" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
