import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SeatingAvailabilityQsToggle from "./SeatingAvailabilityQsToggle";

test("renders toggle button group; (interactions tested in BooleanQsToggle.test)", () => {
  render(
    <MemoryRouter>
      <SeatingAvailabilityQsToggle />
    </MemoryRouter>
  );

  const label = /seat availability/i;
  screen.getByRole("heading", { name: label, level: 3 });
  screen.getByRole("group", { name: label });
  screen.getByRole("button", { name: /has open seat\(s\)/i });
  screen.getByRole("button", { name: /no open seat/i });
});
