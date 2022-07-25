import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Filters, {
  creatorSearchLabel,
  nameSearchLabel,
  seatedStatusLabel,
  seatingAvailabilityLabel,
} from "./Filters";

test("renders filters; (interactions tested thoroughly in subcomponents)", () => {
  render(
    <MemoryRouter>
      <Filters />
    </MemoryRouter>
  );

  screen.getByRole("heading", { name: /filters/i, level: 2 });
  screen.getByRole("searchbox", { name: creatorSearchLabel });
  screen.getByRole("searchbox", { name: nameSearchLabel });
  screen.getByRole("group", { name: seatedStatusLabel });
  screen.getByRole("group", { name: seatingAvailabilityLabel });
});
