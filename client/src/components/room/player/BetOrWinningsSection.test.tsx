import { render, screen, within } from "@testing-library/react";
import BetOrWinningsSection, {
  positiveNumToCurrencyFormat,
} from "./BetOrWinningsSection";

test(`renders bet section with positive amount`, () => {
  const label = "Bet";
  const amount = 1384.21;

  render(<BetOrWinningsSection seatNumber={1} label={label} amount={amount} />);

  const betRegion = screen.getByRole("region", { name: label });
  within(betRegion).getByRole("heading", { level: 3, name: label });
  within(betRegion).getByText(positiveNumToCurrencyFormat(amount)!);
});

test(`renders bet section with no amount`, () => {
  const label = "Bet";
  const amount = 0;

  render(<BetOrWinningsSection seatNumber={1} label={label} amount={amount} />);

  const betRegion = screen.getByRole("region", { name: label });
  within(betRegion).getByRole("heading", { level: 3, name: label });
  expect(within(betRegion).queryByText("$")).toBeNull();
});

test(`renders winnings section with positive amount`, () => {
  const label = "Winnings";
  const amount = 1384.21;

  render(<BetOrWinningsSection seatNumber={1} label={label} amount={amount} />);

  const betRegion = screen.getByRole("region", { name: label });
  within(betRegion).getByRole("heading", { level: 3, name: label });
  within(betRegion).getByText(positiveNumToCurrencyFormat(amount)!);
});

test(`renders winnings section with no amount`, () => {
  const label = "Winnings";
  const amount = 0;

  render(<BetOrWinningsSection seatNumber={1} label={label} amount={amount} />);

  const betRegion = screen.getByRole("region", { name: label });
  within(betRegion).getByRole("heading", { level: 3, name: label });
  expect(within(betRegion).queryByText("$")).toBeNull();
});
