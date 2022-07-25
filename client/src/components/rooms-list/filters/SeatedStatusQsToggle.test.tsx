import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SeatedStatusQsToggle from "./SeatedStatusQsToggle";

test("renders toggle button group; (interactions tested in BooleanQsToggle.test)", () => {
  render(
    <MemoryRouter>
      <SeatedStatusQsToggle />
    </MemoryRouter>
  );

  const label = /your status/i;
  screen.getByRole("heading", { name: label, level: 3 });
  screen.getByRole("group", { name: label });
  screen.getByRole("button", { name: /you're seated/i });
  screen.getByRole("button", { name: /you're not seated/i });
});
