import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SeatedStatusQsToggle, {
  label,
  trueButtonLabel,
  falseButtonLabel,
} from "./SeatedStatusQsToggle";

test("renders toggle button group; (interactions tested in BooleanQsToggle.test)", () => {
  render(
    <MemoryRouter>
      <SeatedStatusQsToggle />
    </MemoryRouter>
  );

  screen.getByRole("heading", { name: label, level: 3 });
  screen.getByRole("group", { name: label });
  screen.getByRole("button", { name: trueButtonLabel });
  screen.getByRole("button", { name: falseButtonLabel });
});
