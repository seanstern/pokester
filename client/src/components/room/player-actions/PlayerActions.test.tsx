import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayerActions, {
  amountLabel,
  postStandRedirectLocation,
} from "./PlayerActions";
import { PokerRooms } from "@pokester/common-api";
import { QueryClient, QueryClientProvider } from "react-query";
import server, { validRoomIdForPatch } from "../../../__fixtures__/server";
import { MemoryRouter, Route } from "react-router-dom";

const PlayerAction = PokerRooms.Act.PlayerAction;

const possibleLegalActions = Object.values(PlayerAction);
const defaultLegalActions = [
  PlayerAction.STAND,
  PlayerAction.CHECK,
  PlayerAction.BET,
];
const highPriorityLegalActions = [
  PlayerAction.FOLD,
  PlayerAction.DEAL,
  PlayerAction.RAISE,
];
const getOmittedLegalActions = (legalActions: PokerRooms.Act.PlayerAction[]) =>
  possibleLegalActions.filter((pla) => !legalActions.includes(pla));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders fold, call, raise actions when they are the only legal actions; clicking each button does not trigger alert", async () => {
  const user = userEvent.setup();
  const legalActions = [
    PlayerAction.FOLD,
    PlayerAction.CALL,
    PlayerAction.RAISE,
  ];
  render(
    <QueryClientProvider client={new QueryClient()}>
      <PlayerActions roomId={validRoomIdForPatch} legalActions={legalActions} />
    </QueryClientProvider>
  );

  expect(screen.queryByRole("alert")).toBeNull();

  getOmittedLegalActions(legalActions).forEach((omittedLegalAction) =>
    expect(
      screen.queryByRole("button", { name: omittedLegalAction })
    ).toBeNull()
  );

  const amountTextBox = screen.getByRole("textbox", { name: amountLabel });
  await user.clear(amountTextBox);
  await user.type(amountTextBox, "15");

  for (const legalAction of legalActions) {
    const actionButton = screen.getByRole("button", { name: legalAction });
    expect(actionButton).toBeEnabled();
    await user.click(actionButton);
    expect(screen.queryByRole("alert")).toBeNull();
  }
});

test("renders bet, check, stand when they are the only legal actions; clicking each button does not trigger alert; clicking stand redirects page", async () => {
  const user = userEvent.setup();

  let pathname: string | undefined;
  const legalActions = [
    PlayerAction.BET,
    PlayerAction.CHECK,
    PlayerAction.STAND,
  ];
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <PlayerActions
          roomId={validRoomIdForPatch}
          legalActions={legalActions}
        />
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

  getOmittedLegalActions(legalActions).forEach((omittedLegalAction) =>
    expect(
      screen.queryByRole("button", { name: omittedLegalAction })
    ).toBeNull()
  );

  const amountTextBox = screen.getByRole("textbox", { name: amountLabel });
  await user.clear(amountTextBox);
  await user.type(amountTextBox, "15");

  for (const legalAction of legalActions) {
    const actionButton = screen.getByRole("button", { name: legalAction });
    expect(actionButton).toBeEnabled();
    await user.click(actionButton);
    expect(screen.queryByRole("alert")).toBeNull();
  }

  await waitFor(() => expect(pathname).toBe(postStandRedirectLocation));
});

test("renders disabled bet, disabled check, disabled stand when there are no legal actions", async () => {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <PlayerActions roomId={validRoomIdForPatch} />
    </QueryClientProvider>
  );

  expect(screen.queryByRole("alert")).toBeNull();

  getOmittedLegalActions(defaultLegalActions).forEach((omittedLegalAction) =>
    expect(
      screen.queryByRole("button", { name: omittedLegalAction })
    ).toBeNull()
  );

  defaultLegalActions.forEach((defaultLegalAction) => {
    const actionButton = screen.getByRole("button", {
      name: defaultLegalAction,
    });
    expect(actionButton).toBeDisabled();
  });
});

test("renders high priority actions when all legal actions present", async () => {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <PlayerActions
        roomId={validRoomIdForPatch}
        legalActions={possibleLegalActions}
      />
    </QueryClientProvider>
  );

  expect(screen.queryByRole("alert")).toBeNull();

  getOmittedLegalActions(highPriorityLegalActions).forEach(
    (omittedLegalAction) =>
      expect(
        screen.queryByRole("button", { name: omittedLegalAction })
      ).toBeNull()
  );

  highPriorityLegalActions.forEach((highPriorityLegalAction) => {
    const actionButton = screen.getByRole("button", {
      name: highPriorityLegalAction,
    });
    expect(actionButton).toBeEnabled();
  });
});

describe("renders alert when clicked action produces server error", () => {
  afterAll(() => jest.restoreAllMocks());

  test("stand, 404", async () => {
    // Suppress error logs in unit test
    const { error } = console;
    jest
      .spyOn(console, "error")
      .mockImplementation((err, ...optionalParams) => {
        if (err.isAxiosError && err.toJSON().status === 404) {
          return;
        }
        error(err, ...optionalParams);
      });

    const user = userEvent.setup();
    render(
      <QueryClientProvider client={new QueryClient()}>
        <PlayerActions
          roomId={`invalid${validRoomIdForPatch}`}
          legalActions={[PlayerAction.STAND]}
        />
      </QueryClientProvider>
    );

    expect(screen.queryByRole("alert")).toBeNull();

    user.click(screen.getByRole("button", { name: PlayerAction.STAND }));

    await screen.findByRole("alert");
  });
});
