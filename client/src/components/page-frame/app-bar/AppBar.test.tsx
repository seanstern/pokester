import { createTheme } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mediaQuery from "css-mediaquery";
import AppBar, {
  getHeading,
  logoAlt,
  menuButtonLabel,
  showSiteNameBreakPoint,
} from "./AppBar";

const createMatchMedia = (width: number) => (query: string) =>
  ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => {},
    removeListener: () => {},
  } as unknown as ReturnType<typeof window.matchMedia>);

const defaultTheme = createTheme();

const showSiteNameWidth =
  defaultTheme.breakpoints.values[showSiteNameBreakPoint];

test(`renders title (include site name) and clickable menu button at or above "${showSiteNameBreakPoint}" breakpoint`, async () => {
  window.matchMedia = createMatchMedia(showSiteNameWidth);

  const user = userEvent.setup();

  const title = "Some Title";
  const onMenuClick = jest.fn(() => {});

  render(<AppBar onMenuClick={onMenuClick} title={title} />);

  screen.getByRole("heading", {
    name: getHeading(true, title),
    level: 1,
  });

  screen.getByRole("img", { name: logoAlt });

  const menuButton = screen.getByRole("button", { name: menuButtonLabel });

  await user.click(menuButton);

  expect(onMenuClick).toHaveBeenCalledTimes(1);
});

test(`renders site name only (when title is "") and clickable menu button at or above "${showSiteNameBreakPoint}" breakpoint`, async () => {
  window.matchMedia = createMatchMedia(showSiteNameWidth);

  const user = userEvent.setup();

  const title = "";
  const onMenuClick = jest.fn(() => {});

  render(<AppBar onMenuClick={onMenuClick} title={title} />);

  screen.getByRole("heading", {
    name: getHeading(true, title),
    level: 1,
  });

  screen.getByRole("img", { name: logoAlt });

  const menuButton = screen.getByRole("button", { name: menuButtonLabel });

  await user.click(menuButton);

  expect(onMenuClick).toHaveBeenCalledTimes(1);
});

test(`renders title (excluding site name) and clickable menu button below "${showSiteNameBreakPoint}" breakpoint`, async () => {
  window.matchMedia = createMatchMedia(showSiteNameWidth - 1);

  const user = userEvent.setup();

  const title = "Some Title";
  const onMenuClick = jest.fn(() => {});

  render(<AppBar onMenuClick={onMenuClick} title={title} />);

  screen.getByRole("heading", {
    name: getHeading(false, title),
    level: 1,
  });

  screen.getByRole("img", { name: logoAlt });

  const menuButton = screen.getByRole("button", { name: menuButtonLabel });

  await user.click(menuButton);

  expect(onMenuClick).toHaveBeenCalledTimes(1);
});
