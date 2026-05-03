import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { AuthProvider } from "../contexts/AuthContext";

function renderLayout(user: { id: string; nome: string; email: string; perfil: string }) {
  localStorage.setItem("token", "token");
  localStorage.setItem("user", JSON.stringify(user));

  render(
    <MemoryRouter initialEntries={["/reimbursements"]}>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/reimbursements" element={<div>Conteúdo</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("AppLayout", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("mostra ação de nova solicitação para colaborador", () => {
    renderLayout({
      id: "user-1",
      nome: "Colaborador",
      email: "colaborador@teste.com",
      perfil: "COLABORADOR"
    });

    expect(screen.getByText("Nova")).toBeInTheDocument();
    expect(screen.queryByText("Categorias")).not.toBeInTheDocument();
  });

  it("mostra gestão de categorias para admin", () => {
    renderLayout({
      id: "user-2",
      nome: "Admin",
      email: "admin@teste.com",
      perfil: "ADMIN"
    });

    expect(screen.getByText("Categorias")).toBeInTheDocument();
    expect(screen.queryByText("Nova")).not.toBeInTheDocument();
  });
});
