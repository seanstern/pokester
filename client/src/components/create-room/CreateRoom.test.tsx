import { waitFor, render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route } from "react-router-dom";
import CreateRoom, {
  title,
  nameLabel,
  smallBlindLabel,
  defaultSmallBlind,
  bigBlindLabel,
  defaultBigBlind,
  buyInLabel,
  defaultBuyIn,
  createLabel,
} from "./CreateRoom";
import server from "../../__fixtures__/server";
import { QueryClient, QueryClientProvider } from "react-query";

const titleRegExp = new RegExp(`^${title}$`, "i");
const nameLabelRegExp = new RegExp(`^${nameLabel}$`, "i");
const smallBlindLabelRegExp = new RegExp(`^${smallBlindLabel}$`, "i");
const bigBlindLabelRegExp = new RegExp(`^${bigBlindLabel}$`, "i");
const buyInLabelRegExp = new RegExp(`^${buyInLabel}$`, "i");

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders initial form", async () => {
  const user = userEvent.setup();
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <CreateRoom />
      </MemoryRouter>
    </QueryClientProvider>
  );

  screen.getByRole("heading", { name: titleRegExp });

  expect(screen.queryByRole("alert")).toBeNull();

  const nameTextBox = screen.getByRole("textbox", {
    name: nameLabelRegExp,
  });
  expect(nameTextBox).toBeEnabled();
  expect(nameTextBox).toBeRequired();
  expect(nameTextBox).toBeInvalid();
  expect(nameTextBox).toHaveAccessibleDescription();
  expect(nameTextBox).toHaveDisplayValue("");

  const smallBlindTextBox = screen.getByRole("textbox", {
    name: smallBlindLabelRegExp,
  });
  expect(smallBlindTextBox).toBeEnabled();
  expect(smallBlindTextBox).toBeRequired();
  expect(smallBlindTextBox).toBeValid();
  expect(smallBlindTextBox).toHaveAccessibleDescription();
  expect(smallBlindTextBox).toHaveDisplayValue(defaultSmallBlind.toString());

  const bigBlindTextBox = screen.getByRole("textbox", {
    name: bigBlindLabelRegExp,
  });
  expect(bigBlindTextBox).toBeEnabled();
  expect(bigBlindTextBox).not.toBeRequired();
  expect(bigBlindTextBox).toBeValid();
  expect(bigBlindTextBox).toHaveAccessibleDescription();
  expect(bigBlindTextBox).toHaveDisplayValue(defaultBigBlind.toString());
  expect(bigBlindTextBox).toHaveAttribute("readOnly");

  const buyInTextBox = screen.getByRole("textbox", {
    name: buyInLabelRegExp,
  });
  expect(buyInTextBox).toBeEnabled();
  expect(buyInTextBox).toBeRequired();
  expect(buyInTextBox).toBeValid();
  expect(buyInTextBox).toHaveAccessibleDescription();
  expect(buyInTextBox).toHaveDisplayValue(defaultBuyIn.toString());

  const createButton = screen.getByRole("button", { name: createLabel });
  expect(createButton).toBeEnabled();

  await user.type(nameTextBox, "Foo!");
  await act(() => user.click(smallBlindTextBox));
  await waitFor(() =>
    expect(nameTextBox).toHaveAccessibleDescription(new RegExp(nameLabel, "i"))
  );
  await user.clear(smallBlindTextBox);
  await user.type(smallBlindTextBox, "1");
  await waitFor(() => expect(bigBlindTextBox).toHaveDisplayValue("2"));
});

describe("renders error message and disables create button for invalid; no error message and enabled create button for valid", () => {
  test("name", async () => {
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <CreateRoom />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const nameTextBox = screen.getByRole("textbox", {
      name: nameLabelRegExp,
    });

    const bigBlindTextBox = screen.getByRole("textbox", {
      name: bigBlindLabelRegExp,
    });

    const createButton = screen.getByRole("button", { name: createLabel });

    await user.type(nameTextBox, " ! $ %");
    await act(() => user.click(bigBlindTextBox));

    await waitFor(() =>
      expect(nameTextBox).toHaveAccessibleDescription(
        new RegExp(nameLabel, "i")
      )
    );
    expect(nameTextBox).toBeInvalid();
    expect(createButton).toBeDisabled();

    await act(() => user.clear(nameTextBox));
    await act(() => user.type(nameTextBox, "myfirstroom"));

    await waitFor(() =>
      expect(nameTextBox).not.toHaveAccessibleDescription(
        new RegExp(nameLabel, "i")
      )
    );
    expect(nameTextBox).toBeValid();
    expect(createButton).toBeEnabled();
  });

  test("smallBlind", async () => {
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <CreateRoom />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const smallBlindTextBox = screen.getByRole("textbox", {
      name: smallBlindLabelRegExp,
    });

    const bigBlindTextBox = screen.getByRole("textbox", {
      name: bigBlindLabelRegExp,
    });

    const createButton = screen.getByRole("button", { name: createLabel });

    await user.clear(smallBlindTextBox);
    await act(() => user.type(smallBlindTextBox, (-10).toString()));
    await act(() => user.click(bigBlindTextBox));

    await waitFor(() =>
      expect(smallBlindTextBox).toHaveAccessibleDescription(
        new RegExp(smallBlindLabel, "i")
      )
    );
    expect(smallBlindTextBox).toBeInvalid();
    expect(createButton).toBeDisabled();

    await act(() => user.clear(smallBlindTextBox));
    await act(() => user.type(smallBlindTextBox, defaultSmallBlind.toString()));

    await waitFor(() =>
      expect(smallBlindTextBox).not.toHaveAccessibleDescription(
        new RegExp(smallBlindLabel, "i")
      )
    );
    expect(smallBlindTextBox).toBeValid();
    expect(createButton).toBeEnabled();
  });

  test("buyIn", async () => {
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <CreateRoom />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const buyInTextBox = screen.getByRole("textbox", {
      name: buyInLabelRegExp,
    });

    const bigBlindTextBox = screen.getByRole("textbox", {
      name: bigBlindLabelRegExp,
    });

    const createButton = screen.getByRole("button", { name: createLabel });

    await user.clear(buyInTextBox);
    await act(() => user.type(buyInTextBox, defaultBigBlind.toString()));
    await act(() => user.click(bigBlindTextBox));

    await waitFor(() =>
      expect(buyInTextBox).toHaveAccessibleDescription(
        new RegExp(buyInLabel, "i")
      )
    );
    expect(buyInTextBox).toBeInvalid();
    expect(createButton).toBeDisabled();

    await act(() => user.clear(buyInTextBox));
    await act(() => user.type(buyInTextBox, defaultBuyIn.toString()));

    await waitFor(() =>
      expect(buyInTextBox).not.toHaveAccessibleDescription(
        new RegExp(smallBlindLabel, "i")
      )
    );
    expect(buyInTextBox).toBeValid();
    expect(createButton).toBeEnabled();
  });
});

test("renders error message, disable create button after clicking create with invalid input", async () => {
  const user = userEvent.setup();
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <CreateRoom />
      </MemoryRouter>
    </QueryClientProvider>
  );

  const nameTextBox = screen.getByRole("textbox", {
    name: nameLabelRegExp,
  });

  const createButton = screen.getByRole("button", { name: createLabel });

  await act(() => user.click(createButton));

  await waitFor(() =>
    expect(nameTextBox).toHaveAccessibleDescription(new RegExp(nameLabel, "i"))
  );
  expect(nameTextBox).toBeInvalid();
  expect(nameTextBox).toHaveFocus();
  expect(createButton).toBeDisabled();
});

test("creates new room and redirects to it after clicking create with valid input", async () => {
  const user = userEvent.setup();
  let pathname: string | undefined;
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <CreateRoom />
        <Route
          path="*"
          render={({ location }) => {
            pathname = location.pathname;
            return null;
          }}
        />
      </MemoryRouter>
    </QueryClientProvider>
  );

  const nameTextBox = screen.getByRole("textbox", {
    name: nameLabelRegExp,
  });

  const createButton = screen.getByRole("button", { name: createLabel });

  await user.type(nameTextBox, "an example room name");
  await act(() => user.click(createButton));

  await waitFor(() => expect(pathname).toMatch(/^\/rooms\/[^/]+$/));
});
