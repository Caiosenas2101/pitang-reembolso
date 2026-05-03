import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { listCategories } from "../services/categories.service";
import { listReimbursements } from "../services/reimbursements.service";

jest.mock("../services/categories.service", () => ({
  listCategories: jest.fn()
}));

jest.mock("../services/reimbursements.service", () => ({
  listReimbursements: jest.fn()
}));

describe("Dashboard", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();

    localStorage.setItem("token", "token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "admin-1",
        nome: "Admin",
        email: "admin@teste.com",
        perfil: "ADMIN"
      })
    );

    (listCategories as jest.Mock).mockResolvedValue([
      {
        id: "categoria-1",
        nome: "Transporte",
        ativo: true,
        criadoEm: "2026-05-01",
        atualizadoEm: "2026-05-01"
      }
    ]);

    (listReimbursements as jest.Mock).mockResolvedValue([]);
  });

  it("envia filtros de status e categoria para a API", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );

    await screen.findByLabelText("Status");
    await user.selectOptions(screen.getByLabelText("Status"), "APROVADO");

    await waitFor(() => {
      expect(listReimbursements).toHaveBeenLastCalledWith({
        status: "APROVADO",
        sortBy: "dataDespesa",
        sortOrder: "desc"
      });
    });

    await user.selectOptions(screen.getByLabelText("Categoria"), "categoria-1");

    await waitFor(() => {
      expect(listReimbursements).toHaveBeenLastCalledWith({
        status: "APROVADO",
        categoriaId: "categoria-1",
        sortBy: "dataDespesa",
        sortOrder: "desc"
      });
    });
  });

  it("envia ordenação por data ou valor para a API", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );

    await screen.findByLabelText("Ordenar por");
    await user.selectOptions(screen.getByLabelText("Ordenar por"), "valor");
    await user.selectOptions(screen.getByLabelText("Direção"), "asc");

    await waitFor(() => {
      expect(listReimbursements).toHaveBeenLastCalledWith({
        sortBy: "valor",
        sortOrder: "asc"
      });
    });
  });
});
