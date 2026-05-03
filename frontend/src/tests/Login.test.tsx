import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosError } from "axios";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { Login } from "../pages/Login/Login";
import { loginRequest } from "../services/auth.service";

jest.mock("../services/auth.service", () => ({
  loginRequest: jest.fn()
}));

describe("Login", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renderiza campos obrigatórios", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
  });

  it("exibe mensagem de erro para credenciais inválidas", async () => {
    const user = userEvent.setup();
    const error = new AxiosError(
      "Credenciais inválidas",
      "401",
      undefined,
      undefined,
      {
        data: { message: "Credenciais inválidas" },
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        config: {} as never
      }
    );

    (loginRequest as jest.Mock).mockRejectedValueOnce(error);

    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText("E-mail"), "colaborador@teste.com");
    await user.type(screen.getByLabelText("Senha"), "senha-errada");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("Credenciais inválidas")).toBeInTheDocument();
  });
});
