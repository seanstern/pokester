import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResponsiveDrawer from "./ResponsiveDrawer";

test("renders mobile drawer that calls onCloseForMobile when children are clicked", async () => {
  const user = userEvent.setup();
  const childName = "Example Child";
  const onCloseForMobile = jest.fn(() => {});

  render(
    <ResponsiveDrawer
      isOpenForMobile
      onCloseForMobile={onCloseForMobile}
      drawerWidth={100}
    >
      <h1>{childName}</h1>
    </ResponsiveDrawer>
  );

  await user.click(screen.getByRole("heading", { name: childName }));

  expect(onCloseForMobile).toHaveBeenCalledTimes(1);
});

test("renders non-mobile drawer that does not call onCloseForMobile when children are clicked", async () => {
  const user = userEvent.setup();
  const childName = "Example Child";
  const onCloseForMobile = jest.fn(() => {});

  render(
    <ResponsiveDrawer
      isOpenForMobile={false}
      onCloseForMobile={onCloseForMobile}
      drawerWidth={100}
    >
      <h1>{childName}</h1>
    </ResponsiveDrawer>
  );

  await user.click(screen.getByRole("heading", { name: childName }));

  expect(onCloseForMobile).not.toHaveBeenCalled();
});
