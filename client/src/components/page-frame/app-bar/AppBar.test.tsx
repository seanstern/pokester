import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { flatNavConfig } from "../navigation";
import AppBar, { logoAlt, menuButtonLabel } from "./AppBar";

describe("renders with navConfig based title", () => {
  test.each(flatNavConfig)("$path renders $title", async ({ path, title }) => {
    const user = userEvent.setup();

    const onMenuClick = jest.fn(() => {});

    render(
      <MemoryRouter initialEntries={[path]}>
        <AppBar onMenuClick={onMenuClick} />
      </MemoryRouter>
    );

    screen.getByRole("heading", { name: title, level: 1 });

    screen.getByRole("img", { name: logoAlt });

    const menuButton = screen.getByRole("button", { name: menuButtonLabel });

    await user.click(menuButton);

    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });
});

describe("renders with overridden title", () => {
  const overriddentTitle = "Overridden Title";
  test.each(flatNavConfig)(
    `$path renders ${overriddentTitle}`,
    async ({ path }) => {
      const user = userEvent.setup();

      const onMenuClick = jest.fn(() => {});

      render(
        <MemoryRouter initialEntries={[path]}>
          <AppBar onMenuClick={onMenuClick} title={overriddentTitle} />
        </MemoryRouter>
      );

      screen.getByRole("heading", { name: overriddentTitle, level: 1 });

      screen.getByRole("img", { name: logoAlt });

      const menuButton = screen.getByRole("button", { name: menuButtonLabel });

      await user.click(menuButton);

      expect(onMenuClick).toHaveBeenCalledTimes(1);
    }
  );
});
