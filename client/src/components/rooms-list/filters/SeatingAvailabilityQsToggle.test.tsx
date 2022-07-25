import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SeatingAvailabilityQsToggle, {
  label,
  trueButtonLabel,
  falseButtonLabel,
} from "./SeatingAvailabilityQsToggle";

test("renders toggle button group; (interactions tested in BooleanQsToggle.test)", () => {
  render(
    <MemoryRouter>
      <SeatingAvailabilityQsToggle />
    </MemoryRouter>
  );

  screen.getByRole("heading", { name: label, level: 3 });
  screen.getByRole("group", { name: label });
  screen.getByRole("button", { name: trueButtonLabel });
  screen.getByRole("button", { name: falseButtonLabel });
});
