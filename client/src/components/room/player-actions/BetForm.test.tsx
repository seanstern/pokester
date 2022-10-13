import { PokerRooms } from "@pokester/common-api";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import server from "../../../__fixtures__/server";
import withInjectedActInRoom from "../test-utils/withInjectedActInRoom";
import RawBetForm, { amountLabel } from "./BetForm";

const BetForm = withInjectedActInRoom("someRoomId", RawBetForm);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("renders initial form", () => {
  test("action: bet, disabled: false", async () => {
    const action = PokerRooms.Act.PlayerAction.BET;
    const amountAtRoundStart = 3.5;

    // See "Resolving act warning during test" at
    // https://react-hook-form.com/advanced-usage/#TestingForm
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <BetForm
            action={action}
            disabled={false}
            amountAtRoundStart={amountAtRoundStart}
          />
        </QueryClientProvider>
      );
    });

    const amountTextBox = screen.getByRole("textbox", { name: amountLabel });
    expect(amountTextBox).toBeEnabled();
    expect(amountTextBox).toBeRequired();
    expect(amountTextBox).toBeValid();
    expect(amountTextBox).toHaveDisplayValue(amountAtRoundStart.toString());

    const actionButton = screen.getByRole("button", { name: action });
    expect(actionButton).toBeEnabled();
  });

  test("action: raise, disabled: true", async () => {
    const action = PokerRooms.Act.PlayerAction.RAISE;
    const amountAtRoundStart = 1;

    // See "Resolving act warning during test" at
    // https://react-hook-form.com/advanced-usage/#TestingForm
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <BetForm
            action={action}
            disabled={true}
            amountAtRoundStart={amountAtRoundStart}
          />
        </QueryClientProvider>
      );
    });

    const amountTextBox = screen.getByRole("textbox", { name: amountLabel });
    expect(amountTextBox).toBeDisabled();
    expect(amountTextBox).toBeRequired();
    expect(amountTextBox).toBeValid();
    expect(amountTextBox).toHaveDisplayValue(amountAtRoundStart.toString());

    const actionButton = screen.getByRole("button", { name: action });
    expect(actionButton).toBeDisabled();
  });
});

test("rerenders with amount as amountAtRoundStart when currentRound changes", async () => {
  const user = userEvent.setup();

  const action = PokerRooms.Act.PlayerAction.BET;
  const amountAtRoundStart = 3.5;

  let rerender: ReturnType<typeof render>["rerender"] | undefined;

  // See "Resolving act warning during test" at
  // https://react-hook-form.com/advanced-usage/#TestingForm
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    const { rerender: returnedRerender } = render(
      <QueryClientProvider client={new QueryClient()}>
        <BetForm
          action={action}
          disabled={false}
          amountAtRoundStart={amountAtRoundStart}
        />
      </QueryClientProvider>
    );
    rerender = returnedRerender;
  });

  const amountTextBox = screen.getByRole("textbox", { name: amountLabel });
  expect(amountTextBox).toHaveDisplayValue(amountAtRoundStart.toString());

  const userEnteredAmount = "15";
  await user.clear(amountTextBox);
  await user.type(amountTextBox, userEnteredAmount);

  // See "Resolving act warning during test" at
  // https://react-hook-form.com/advanced-usage/#TestingForm
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    if (!rerender) {
      throw new Error("rerender undefined");
    }
    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <BetForm
          action={action}
          disabled={false}
          amountAtRoundStart={amountAtRoundStart}
        />
      </QueryClientProvider>
    );
  });

  expect(amountTextBox).toHaveDisplayValue(userEnteredAmount);

  // See "Resolving act warning during test" at
  // https://react-hook-form.com/advanced-usage/#TestingForm
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    if (!rerender) {
      throw new Error("rerender undefined");
    }
    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <BetForm
          action={action}
          disabled={false}
          amountAtRoundStart={amountAtRoundStart}
          currentRound={PokerRooms.Get.BettingRound.FLOP}
        />
      </QueryClientProvider>
    );
  });

  expect(amountTextBox).toHaveDisplayValue(amountAtRoundStart.toString());
});

test("disables action button and marks textfield invalid for invalid amount; enabled action button and valid textfield for valid amount", async () => {
  const user = userEvent.setup();
  const action = PokerRooms.Act.PlayerAction.BET;
  const invalidAmount = 0;

  // See "Resolving act warning during test" at
  // https://react-hook-form.com/advanced-usage/#TestingForm
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <BetForm
          action={action}
          disabled={false}
          amountAtRoundStart={invalidAmount}
        />
      </QueryClientProvider>
    );
  });
  const amountTextBox = screen.getByRole("textbox", { name: amountLabel });
  const actionButton = screen.getByRole("button", { name: action });
  expect(amountTextBox).toBeValid();
  expect(actionButton).toBeEnabled();

  await user.click(actionButton);
  expect(amountTextBox).toBeInvalid();
  expect(amountTextBox).toBeEnabled();
  expect(actionButton).toBeDisabled();

  await user.clear(amountTextBox);
  await user.type(amountTextBox, "15");
  expect(amountTextBox).toBeValid();
  expect(actionButton).toBeEnabled();

  await user.clear(amountTextBox);
  expect(amountTextBox).toBeInvalid();
  expect(amountTextBox).toBeEnabled();
  expect(actionButton).toBeDisabled();

  await user.type(amountTextBox, "abcd");
  expect(amountTextBox).toBeInvalid();
  expect(amountTextBox).toBeEnabled();
  expect(actionButton).toBeDisabled();

  await user.clear(amountTextBox);
  await user.type(amountTextBox, "0.01");
  expect(amountTextBox).toBeValid();
  expect(amountTextBox).toBeEnabled();
  expect(actionButton).toBeEnabled();

  await user.clear(amountTextBox);
  await user.type(amountTextBox, "-0.01");
  expect(amountTextBox).toBeInvalid();
  expect(amountTextBox).toBeEnabled();
  expect(actionButton).toBeDisabled();

  const finalAmount = 0.02;
  await user.clear(amountTextBox);
  await user.type(amountTextBox, finalAmount.toString());
  expect(amountTextBox).toBeValid();
  expect(amountTextBox).toBeEnabled();
  expect(actionButton).toBeEnabled();
});

test("disables action button and textfield while submitting", async () => {
  const user = userEvent.setup();

  const action = PokerRooms.Act.PlayerAction.BET;
  const amountAtRoundStart = 3.5;

  // See "Resolving act warning during test" at
  // https://react-hook-form.com/advanced-usage/#TestingForm
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <BetForm
          action={action}
          disabled={false}
          amountAtRoundStart={amountAtRoundStart}
        />
      </QueryClientProvider>
    );
  });

  const amountTextBox = screen.getByRole("textbox", { name: amountLabel });
  const actionButton = screen.getByRole("button", { name: action });

  await user.click(actionButton);
  expect(actionButton).toBeDisabled();
  expect(amountTextBox).toBeDisabled();

  await waitFor(() => expect(actionButton).toBeEnabled());
  expect(amountTextBox).toBeEnabled();
});
