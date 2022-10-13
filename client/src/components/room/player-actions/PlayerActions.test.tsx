import { PokerRooms } from "@pokester/common-api";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter, Route } from "react-router-dom";
import server from "../../../__fixtures__/server";
import withInjectedActInRoom from "../test-utils/withInjectedActInRoom";
import RawPlayerActions, {
  amountLabel,
  postStandRedirectLocation,
  playerActionsLabel,
} from "./PlayerActions";

const PlayerActions = withInjectedActInRoom("someRoomId", RawPlayerActions);

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

const enabledActionsCases: {
  prop: PokerRooms.Act.PlayerAction[];
  rendered: PokerRooms.Act.PlayerAction[];
}[] = [
  {
    prop: [PlayerAction.FOLD, PlayerAction.CALL, PlayerAction.RAISE],
    rendered: [PlayerAction.FOLD, PlayerAction.CALL, PlayerAction.RAISE],
  },
  {
    prop: [PlayerAction.BET, PlayerAction.CHECK, PlayerAction.STAND],
    rendered: [PlayerAction.BET, PlayerAction.CHECK, PlayerAction.STAND],
  },
  {
    prop: possibleLegalActions,
    rendered: highPriorityLegalActions,
  },
];

describe("renders enabled", () => {
  test.each(enabledActionsCases)(
    "$rendered actions when $prop are legal actions",
    async ({ prop, rendered }) => {
      const betAtRoundStart = 15;

      // See "Resolving act warning during test" at
      // https://react-hook-form.com/advanced-usage/#TestingForm
      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(async () => {
        render(
          <QueryClientProvider client={new QueryClient()}>
            <PlayerActions
              legalActions={prop}
              betAtRoundStart={betAtRoundStart}
            />
          </QueryClientProvider>
        );
      });

      getOmittedLegalActions(rendered).forEach((omittedLegalAction) =>
        expect(
          screen.queryByRole("button", { name: omittedLegalAction })
        ).toBeNull()
      );

      const playerActionsRegion = screen.getByRole("region", {
        name: playerActionsLabel,
      });

      const amountTextBox = within(playerActionsRegion).getByRole("textbox", {
        name: amountLabel,
      });
      expect(amountTextBox).toHaveDisplayValue(betAtRoundStart.toString());
      expect(amountTextBox).toBeEnabled();

      for (const legalAction of rendered) {
        const actionButton = within(playerActionsRegion).getByRole("button", {
          name: legalAction,
        });
        expect(actionButton).toBeEnabled();
      }
    }
  );
});

describe("during submission disables rendered", () => {
  test.each(enabledActionsCases)(
    "$rendered actions",
    async ({ prop, rendered }) => {
      const user = userEvent.setup();

      const betAtRoundStart = 15;

      // See "Resolving act warning during test" at
      // https://react-hook-form.com/advanced-usage/#TestingForm
      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(async () => {
        render(
          <QueryClientProvider client={new QueryClient()}>
            <PlayerActions
              legalActions={prop}
              betAtRoundStart={betAtRoundStart}
            />
          </QueryClientProvider>
        );
      });

      const playerActionsRegion = screen.getByRole("region", {
        name: playerActionsLabel,
      });

      const amountTextBox = within(playerActionsRegion).getByRole("textbox", {
        name: amountLabel,
      });
      expect(amountTextBox).toBeEnabled();

      for (const legalAction of rendered) {
        const actionButton = within(playerActionsRegion).getByRole("button", {
          name: legalAction,
        });
        expect(actionButton).toBeEnabled();

        await user.click(actionButton);

        expect(amountTextBox).toBeDisabled();
        within(playerActionsRegion)
          .getAllByRole("button")
          .forEach((button) => expect(button).toBeDisabled());

        await waitFor(() => expect(amountTextBox).toBeEnabled());
        within(playerActionsRegion)
          .getAllByRole("button")
          .forEach((button) => expect(button).toBeEnabled());
      }
    }
  );
});

test("renders disabled bet, check, & stand when there are no legal actions", async () => {
  const betAtRoundStart = 15;

  // See "Resolving act warning during test" at
  // https://react-hook-form.com/advanced-usage/#TestingForm
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <PlayerActions betAtRoundStart={betAtRoundStart} />
      </QueryClientProvider>
    );
  });

  getOmittedLegalActions(defaultLegalActions).forEach((omittedLegalAction) =>
    expect(
      screen.queryByRole("button", { name: omittedLegalAction })
    ).toBeNull()
  );

  const playerActionsRegion = screen.getByRole("region", {
    name: playerActionsLabel,
  });

  const amountTextBox = within(playerActionsRegion).getByRole("textbox", {
    name: amountLabel,
  });
  expect(amountTextBox).toHaveDisplayValue(betAtRoundStart.toString());
  expect(amountTextBox).toBeDisabled();

  defaultLegalActions.forEach((defaultLegalAction) => {
    const actionButton = within(playerActionsRegion).getByRole("button", {
      name: defaultLegalAction,
    });
    expect(actionButton).toBeDisabled();
  });
});

test("clicking stand redirects", async () => {
  const user = userEvent.setup();

  const betAtRoundStart = 15;
  const standAction = PlayerAction.STAND;

  let pathname: string | undefined;

  // See "Resolving act warning during test" at
  // https://react-hook-form.com/advanced-usage/#TestingForm
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <PlayerActions
            legalActions={[standAction]}
            betAtRoundStart={betAtRoundStart}
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
  });

  const playerActionsRegion = screen.getByRole("region", {
    name: playerActionsLabel,
  });

  await user.click(
    within(playerActionsRegion).getByRole("button", { name: standAction })
  );

  await waitFor(() => expect(pathname).toBe(postStandRedirectLocation));
});
