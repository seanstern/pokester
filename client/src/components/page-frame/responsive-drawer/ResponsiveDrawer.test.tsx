import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResponsiveDrawer from "./ResponsiveDrawer";

test("renders mobile drawer that only calls onCloseForMobile when nav clicked", async () => {
  const user = userEvent.setup();
  const navName = "Example Nav";
  const settingsName = "Example Settings";
  const onCloseForMobile = jest.fn(() => {});

  render(
    <ResponsiveDrawer
      isOpenForMobile
      onCloseForMobile={onCloseForMobile}
      drawerWidth={100}
      nav={<h1>{navName}</h1>}
      settings={<h1>{settingsName}</h1>}
    />
  );

  await user.click(screen.getByRole("heading", { name: settingsName }));

  expect(onCloseForMobile).not.toHaveBeenCalled();

  await user.click(screen.getByRole("heading", { name: navName }));

  expect(onCloseForMobile).toHaveBeenCalledTimes(1);
});

test("renders non-mobile drawer that doesn't call onCloseForMobile when nav clicked", async () => {
  const user = userEvent.setup();
  const navName = "Example Nav";
  const settingsName = "Example Settings";
  const onCloseForMobile = jest.fn(() => {});

  render(
    <ResponsiveDrawer
      isOpenForMobile={false}
      onCloseForMobile={onCloseForMobile}
      drawerWidth={100}
      nav={<h1>{navName}</h1>}
      settings={<h1>{settingsName}</h1>}
    />
  );

  await user.click(screen.getByRole("heading", { name: settingsName }));

  expect(onCloseForMobile).not.toHaveBeenCalled();

  await user.click(screen.getByRole("heading", { name: navName }));

  expect(onCloseForMobile).not.toHaveBeenCalled();
});
