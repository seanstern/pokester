import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import ErrorSnackbar, { defaultMessage } from "./ErrorSnackbar";

test("renders component with default message when show true", async () => {
  render(<ErrorSnackbar show={true} />);

  const errorSnackbar = screen.getByRole("alert");

  within(errorSnackbar).getByText(defaultMessage);

  const closeButton = screen.getByRole("button", { name: "Close" });

  fireEvent.click(closeButton);

  await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());

  expect(screen.queryByText(defaultMessage)).toBeNull();

  expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
});

test("renders component with custom message when show true", async () => {
  const message = "An error message";

  render(<ErrorSnackbar show={true} message={message} />);

  const errorSnackbar = screen.getByRole("alert");

  expect(within(errorSnackbar).queryByText(defaultMessage)).toBeNull();

  within(errorSnackbar).getByText(message);

  const closeButton = screen.getByRole("button", { name: "Close" });

  fireEvent.click(closeButton);

  await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());

  expect(screen.queryByText(message)).toBeNull();

  expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
});

test("renders nothing when show false", async () => {
  render(<ErrorSnackbar show={false} />);

  expect(screen.queryByRole("alert")).toBeNull();

  expect(screen.queryByText(defaultMessage)).toBeNull();

  expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
});
