import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { flatNavConfig } from "./navConfig";
import NavTitle, { defaultTitle } from "./NavTitle";

describe("when exact is true", () => {
  describe("renders navConfig based title when given paths that match navConfig exactly", () => {
    test.each(flatNavConfig)(
      "$path renders $humanName",
      ({ path, humanName }) => {
        render(
          <MemoryRouter initialEntries={[path]}>
            <NavTitle exact />
          </MemoryRouter>
        );

        screen.getByRole("heading", { name: humanName, level: 1 });
      }
    );
  });

  describe("renders default title when given paths that do not match navConfig exactly", () => {
    const noMatchPathComponent = "noMatch";
    test.each(flatNavConfig)(
      `$path/${noMatchPathComponent} renders ${defaultTitle}`,
      ({ path }) => {
        render(
          <MemoryRouter initialEntries={[`${path}/${noMatchPathComponent}`]}>
            <NavTitle exact />
          </MemoryRouter>
        );

        screen.getByRole("heading", { name: defaultTitle, level: 1 });
      }
    );
  });
});

describe("when exact is false", () => {
  describe("renders navConfig based title when given paths that match navConfig exactly", () => {
    test.each(flatNavConfig)(
      "$path renders $humanName",
      ({ path, humanName }) => {
        render(
          <MemoryRouter initialEntries={[path]}>
            <NavTitle exact={false} />
          </MemoryRouter>
        );

        screen.getByRole("heading", { name: humanName, level: 1 });
      }
    );
  });

  describe("renders navConfig based title when given paths that do not match navConfig exactly", () => {
    const noMatchPathComponent = "noMatch";
    test.each(flatNavConfig)(
      `$path/${noMatchPathComponent} renders $humanName`,
      ({ path, humanName }) => {
        render(
          <MemoryRouter initialEntries={[`${path}/${noMatchPathComponent}`]}>
            <NavTitle exact={false} />
          </MemoryRouter>
        );

        screen.getByRole("heading", { name: humanName, level: 1 });
      }
    );
  });
});

describe("when overrideTitle is defined renders overrideTitle regardless of path", () => {
  const overrideTitle = "An Overridden Title";
  test.each(flatNavConfig)(`$path renders ${overrideTitle}`, ({ path }) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <NavTitle overrideTitle={overrideTitle} />
      </MemoryRouter>
    );

    screen.getByRole("heading", { name: overrideTitle, level: 1 });
  });

  const noMatchPathComponent = "noMatch";
  test.each(flatNavConfig)(
    `$path/${noMatchPathComponent} renders ${overrideTitle}`,
    ({ path }) => {
      render(
        <MemoryRouter initialEntries={[`${path}/${noMatchPathComponent}`]}>
          <NavTitle overrideTitle={overrideTitle} />
        </MemoryRouter>
      );

      screen.getByRole("heading", { name: overrideTitle, level: 1 });
    }
  );
});
