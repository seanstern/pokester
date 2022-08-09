import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route } from "react-router-dom";
import { flatNavConfig, FlatNavConfigEntry } from "./navConfig";
import NavMenu, { navMenuLabel } from "./NavMenu";

const isNavMenuLink = ({ hasChildren }: FlatNavConfigEntry) => !hasChildren;

const navMenuLinks = flatNavConfig.filter(isNavMenuLink);

test.each(navMenuLinks)(
  "renders navigation menu with link to $title under appropriate navConfig category",
  async ({ humanName, ancestorHumanNames, path }) => {
    const user = userEvent.setup();

    let pathname: string | undefined;
    let { container } = render(
      <MemoryRouter>
        <NavMenu />
        <Route
          path="*"
          render={({ location }) => {
            pathname = location.pathname;
            return null;
          }}
        />
      </MemoryRouter>
    );

    container = within(container).getByRole("navigation", {
      name: navMenuLabel,
    });

    ancestorHumanNames.forEach((ancestorHumanName) => {
      container = within(container).getByRole("list", {
        name: ancestorHumanName,
      });
    });

    const link = within(container).getByRole("link", { name: humanName });

    await user.click(link);

    expect(pathname).toBe(path);
  }
);
