import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ReimbursementForm } from "../pages/Reimbursements/ReimbursementForm";
import { listCategories } from "../services/categories.service";
import { createReimbursement } from "../services/reimbursements.service";

jest.mock("../services/categories.service", () => ({
  listCategories: jest.fn()
}));

jest.mock("../services/reimbursements.service", () => ({
  createReimbursement: jest.fn(),
  updateReimbursement: jest.fn()
}));

describe("ReimbursementForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (listCategories as jest.Mock).mockResolvedValue([
      {
        id: "categoria-ativa",
        nome: "Transporte",
        ativo: true,
        criadoEm: "2026-05-01",
        atualizadoEm: "2026-05-01"
      },
      {
        id: "categoria-inativa",
        nome: "Inativa",
        ativo: false,
        criadoEm: "2026-05-01",
        atualizadoEm: "2026-05-01"
      }
    ]);

    (createReimbursement as jest.Mock).mockResolvedValue({ id: "reembolso-1" });
  });

  it("envia formulário de nova solicitação com categoria ativa", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/reimbursements/new"]}>
        <Routes>
          <Route path="/reimbursements/new" element={<ReimbursementForm />} />
          <Route path="/reimbursements/:id" element={<div>Detalhe</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole("option", { name: "Transporte" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Inativa" })).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Categoria"), "categoria-ativa");
    await user.type(screen.getByLabelText("Descrição"), "Taxi para reunião");
    await user.type(screen.getByLabelText("Valor"), "42.50");
    await user.type(screen.getByLabelText("Data da despesa"), "2026-05-01");
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => {
      expect(createReimbursement).toHaveBeenCalledWith({
        categoriaId: "categoria-ativa",
        descricao: "Taxi para reunião",
        valor: 42.5,
        dataDespesa: "2026-05-01"
      });
    });
  });
});
