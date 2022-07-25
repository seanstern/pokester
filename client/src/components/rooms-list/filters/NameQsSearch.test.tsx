import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NameQsSearch, { label } from "./NameQsSearch";

test("renders qs search; (interactions tested in QsSearch.test)", () => {
  render(
    <MemoryRouter>
      <NameQsSearch />
    </MemoryRouter>
  );

  screen.getByRole("searchbox", { name: label });
});
