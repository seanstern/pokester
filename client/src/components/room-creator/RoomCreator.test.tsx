import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter, Route } from "react-router-dom";
import server from "../../__fixtures__/server";
import RoomCreator, {
  bigBlindLabel,
  buyInLabel,
  createLabel,
  defaultBigBlind,
  defaultBuyIn,
  defaultSmallBlind,
  nameLabel,
  smallBlindLabel,
} from "./RoomCreator";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders initial form", async () => {
  const user = userEvent.setup();
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <RoomCreator />
      </MemoryRouter>
    </QueryClientProvider>
  );

  expect(screen.queryByRole("progressbar")).toBeNull();
  expect(screen.queryByRole("alert")).toBeNull();

  const nameTextBox = screen.getByRole("textbox", {
    name: nameLabel,
  });
  expect(nameTextBox).toBeEnabled();
  expect(nameTextBox).toBeRequired();
  expect(nameTextBox).toBeInvalid();
  expect(nameTextBox).toHaveAccessibleDescription();
  expect(nameTextBox).toHaveDisplayValue("");

  const smallBlindTextBox = screen.getByRole("textbox", {
    name: smallBlindLabel,
  });
  expect(smallBlindTextBox).toBeEnabled();
  expect(smallBlindTextBox).toBeRequired();
  expect(smallBlindTextBox).toBeValid();
  expect(smallBlindTextBox).toHaveAccessibleDescription();
  expect(smallBlindTextBox).toHaveDisplayValue(defaultSmallBlind.toString());

  const bigBlindTextBox = screen.getByRole("textbox", {
    name: bigBlindLabel,
  });
  expect(bigBlindTextBox).toBeEnabled();
  expect(bigBlindTextBox).not.toBeRequired();
  expect(bigBlindTextBox).toBeValid();
  expect(bigBlindTextBox).toHaveAccessibleDescription();
  expect(bigBlindTextBox).toHaveDisplayValue(defaultBigBlind.toString());
  expect(bigBlindTextBox).toHaveAttribute("readOnly");

  const buyInTextBox = screen.getByRole("textbox", {
    name: buyInLabel,
  });
  expect(buyInTextBox).toBeEnabled();
  expect(buyInTextBox).toBeRequired();
  expect(buyInTextBox).toBeValid();
  expect(buyInTextBox).toHaveAccessibleDescription();
  expect(buyInTextBox).toHaveDisplayValue(defaultBuyIn.toString());

  const createButton = screen.getByRole("button", { name: createLabel });
  expect(createButton).toBeEnabled();

  await user.type(nameTextBox, "Foo!");
  await user.click(smallBlindTextBox);
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
          <RoomCreator />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const nameTextBox = screen.getByRole("textbox", {
      name: nameLabel,
    });

    const bigBlindTextBox = screen.getByRole("textbox", {
      name: bigBlindLabel,
    });

    const createButton = screen.getByRole("button", { name: createLabel });

    await user.type(nameTextBox, " ! $ %");
    await user.click(bigBlindTextBox);

    await waitFor(() =>
      expect(nameTextBox).toHaveAccessibleDescription(new RegExp("room", "i"))
    );
    expect(nameTextBox).toBeInvalid();
    expect(createButton).toBeDisabled();

    await user.clear(nameTextBox);
    await user.type(nameTextBox, "myfirstroom");

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
          <RoomCreator />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const smallBlindTextBox = screen.getByRole("textbox", {
      name: smallBlindLabel,
    });

    const bigBlindTextBox = screen.getByRole("textbox", {
      name: bigBlindLabel,
    });

    const createButton = screen.getByRole("button", { name: createLabel });

    await user.clear(smallBlindTextBox);
    await user.type(smallBlindTextBox, (-10).toString());
    await user.click(bigBlindTextBox);

    await waitFor(() =>
      expect(smallBlindTextBox).toHaveAccessibleDescription(
        new RegExp(smallBlindLabel, "i")
      )
    );
    expect(smallBlindTextBox).toBeInvalid();
    expect(createButton).toBeDisabled();

    await user.clear(smallBlindTextBox);
    await user.type(smallBlindTextBox, defaultSmallBlind.toString());

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
          <RoomCreator />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const buyInTextBox = screen.getByRole("textbox", {
      name: buyInLabel,
    });

    const bigBlindTextBox = screen.getByRole("textbox", {
      name: bigBlindLabel,
    });

    const createButton = screen.getByRole("button", { name: createLabel });

    await user.clear(buyInTextBox);
    await user.type(buyInTextBox, defaultBigBlind.toString());
    await user.click(bigBlindTextBox);

    await waitFor(() =>
      expect(buyInTextBox).toHaveAccessibleDescription(
        new RegExp(buyInLabel, "i")
      )
    );
    expect(buyInTextBox).toBeInvalid();
    expect(createButton).toBeDisabled();

    await user.clear(buyInTextBox);
    await user.type(buyInTextBox, defaultBuyIn.toString());

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
        <RoomCreator />
      </MemoryRouter>
    </QueryClientProvider>
  );

  const nameTextBox = screen.getByRole("textbox", {
    name: nameLabel,
  });

  const createButton = screen.getByRole("button", { name: createLabel });

  await user.click(createButton);

  await waitFor(() =>
    expect(nameTextBox).toHaveAccessibleDescription(new RegExp(nameLabel, "i"))
  );
  expect(nameTextBox).toBeInvalid();
  expect(createButton).toBeDisabled();
});

test("renders saving data, redirected route on success", async () => {
  const user = userEvent.setup();
  let pathname: string | undefined;
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <RoomCreator />
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

  expect(screen.queryByRole("alert")).toBeNull();
  expect(screen.queryByRole("progressbar")).toBeNull();

  const nameTextBox = screen.getByRole("textbox", {
    name: nameLabel,
  });
  expect(nameTextBox).toBeEnabled();

  const smallBlindTextBox = screen.getByRole("textbox", {
    name: smallBlindLabel,
  });
  expect(smallBlindTextBox).toBeEnabled();

  const bigBlindTextBox = screen.getByRole("textbox", {
    name: bigBlindLabel,
  });
  expect(bigBlindTextBox).toBeEnabled();

  const buyInTextBox = screen.getByRole("textbox", {
    name: buyInLabel,
  });
  expect(buyInTextBox).toBeEnabled();

  const createButton = screen.getByRole("button", { name: createLabel });

  await user.type(nameTextBox, "an example room name");
  await user.click(createButton);

  screen.getByRole("progressbar");
  expect(screen.queryByRole("alert")).toBeNull();
  expect(nameTextBox).toBeDisabled();
  expect(smallBlindTextBox).toBeDisabled();
  expect(bigBlindTextBox).toBeDisabled();
  expect(buyInTextBox).toBeDisabled();

  await waitFor(() => expect(pathname).toMatch(/^\/room\/[^/]+$/));
});
