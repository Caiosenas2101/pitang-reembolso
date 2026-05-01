import { render, screen } from "@testing-library/react";
import { StatusBadge } from "../components/StatusBadge";

describe("StatusBadge", () => {
  it("exibe status da solicitação", () => {
    render(<StatusBadge status="ENVIADO" />);

    expect(screen.getByText("ENVIADO")).toBeInTheDocument();
  });
});
