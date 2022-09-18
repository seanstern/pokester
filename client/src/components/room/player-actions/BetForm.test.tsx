import { PokerRooms } from "@pokester/common-api";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BetForm, { amountLabel, defaultAmount } from "./BetForm";

describe("renders initial form", () => {
  test("action: bet, disabled: false", async () => {
    const action = PokerRooms.Act.PlayerAction.BET;
    render(<BetForm action={action} disabled={false} act={() => {}} />);

    const amountTextBox = screen.getByRole("textbox", { name: amountLabel });
    expect(amountTextBox).toBeEnabled();
    expect(amountTextBox).toBeRequired();
    expect(amountTextBox).toBeValid();
    expect(amountTextBox).toHaveDisplayValue(defaultAmount.toString());

    const actionButton = screen.getByRole("button", { name: action });
    expect(actionButton).toBeEnabled();
  });

  test("action: raise, disabled: true", async () => {
    const action = PokerRooms.Act.PlayerAction.RAISE;
    render(<BetForm action={action} disabled={true} act={() => {}} />);

    const amountTextBox = screen.getByRole("textbox", { name: amountLabel });
    expect(amountTextBox).toBeDisabled();
    expect(amountTextBox).toBeRequired();
    expect(amountTextBox).toBeValid();
    expect(amountTextBox).toHaveDisplayValue(defaultAmount.toString());

    const actionButton = screen.getByRole("button", { name: action });
    expect(actionButton).toBeDisabled();
  });
});

test("disables action button and marks textfield invalid for invalid amount; enabled action button and valid textfield for valid amount", async () => {
  const user = userEvent.setup();
  const action = PokerRooms.Act.PlayerAction.BET;
  const act = jest.fn();
  render(<BetForm action={action} disabled={false} act={act} />);

  const amountTextBox = screen.getByRole("textbox", { name: amountLabel });
  const actionButton = screen.getByRole("button", { name: action });
  expect(amountTextBox).toBeValid();
  expect(actionButton).toBeEnabled();

  await user.click(actionButton);
  expect(amountTextBox).toBeInvalid();
  expect(actionButton).toBeDisabled();
  expect(act).not.toHaveBeenCalled();

  await user.clear(amountTextBox);
  await user.type(amountTextBox, "15");
  expect(amountTextBox).toBeValid();
  expect(actionButton).toBeEnabled();

  await user.clear(amountTextBox);
  expect(amountTextBox).toBeInvalid();
  expect(actionButton).toBeDisabled();

  await user.type(amountTextBox, "abcd");
  expect(amountTextBox).toBeInvalid();
  expect(actionButton).toBeDisabled();

  await user.clear(amountTextBox);
  await user.type(amountTextBox, "0.01");
  expect(amountTextBox).toBeValid();
  expect(actionButton).toBeEnabled();

  await user.clear(amountTextBox);
  await user.type(amountTextBox, "-0.01");
  expect(amountTextBox).toBeInvalid();
  expect(actionButton).toBeDisabled();

  const finalAmount = 0.02;
  await user.clear(amountTextBox);
  await user.type(amountTextBox, finalAmount.toString());
  expect(amountTextBox).toBeValid();
  expect(actionButton).toBeEnabled();

  await user.click(actionButton);
  expect(act).toHaveBeenCalledTimes(1);
  expect(act).toHaveBeenCalledWith({ action, amount: finalAmount });
});
