import { PokerRooms } from "@pokester/common-api";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider, setLogger } from "react-query";
import { MemoryRouter, Route } from "react-router-dom";
import server, { validRoomIdForPatch } from "../../../__fixtures__/server";
import PlayerActions, {
  amountLabel,
  postStandRedirectLocation,
} from "./PlayerActions";
import { serverError } from "../../../queries/poker-rooms/useAct.fixture";
import { defaultMessage } from "../../utils/ErrorSnackbar";

setLogger({ log: console.log, warn: console.warn, error: () => {} });

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
    await waitFor(() => expect(actionButton).toBeEnabled());
    expect(screen.queryByRole("alert")).toBeNull();
    await user.click(actionButton);
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
    await waitFor(() => expect(actionButton).toBeEnabled());
    expect(screen.queryByRole("alert")).toBeNull();
    await user.click(actionButton);
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
  test("stand, 500", async () => {
    const user = userEvent.setup();

    server.use(serverError);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <PlayerActions
          roomId={validRoomIdForPatch}
          legalActions={[PlayerAction.STAND]}
        />
      </QueryClientProvider>
    );

    expect(screen.queryByRole("alert")).toBeNull();

    await user.click(screen.getByRole("button", { name: PlayerAction.STAND }));

    const alert = await screen.findByRole("alert");
    within(alert).getByText(defaultMessage);
  });
});
