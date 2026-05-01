import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { PrivateRoute } from "../components/PrivateRoute";
import { AuthProvider } from "../contexts/AuthContext";
import { Login } from "../pages/Login/Login";

describe("PrivateRoute", () => {
  it("redireciona usuário sem token para login", () => {
    localStorage.clear();

    render(
      <MemoryRouter initialEntries={["/privada"]}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/privada" element={<div>Privada</div>} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Entrar" })).toBeInTheDocument();
  });
});
