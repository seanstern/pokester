import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreatorQsSearch, { label } from "./CreatorQsSearch";

test("renders qs search; (interactions tested in QsSearch.test)", () => {
  render(
    <MemoryRouter>
      <CreatorQsSearch />
    </MemoryRouter>
  );

  screen.getByRole("searchbox", { name: label });
});
