import { render, screen, within } from "@testing-library/react";
import BetOrWinningsSection, {
  betLabel,
  positiveNumToCurrencyFormat,
  winningsLabel,
} from "./BetOrWinningsSection";

test(`renders bet section with positive amount`, () => {
  const amount = 1384.21;

  render(
    <BetOrWinningsSection seatNumber={1} label={betLabel} amount={amount} />
  );

  expect(screen.queryByRole("region", { name: winningsLabel })).toBeNull();
  expect(
    screen.queryByRole("heading", { level: 3, name: winningsLabel })
  ).toBeNull();

  const betRegion = screen.getByRole("region", { name: betLabel });
  within(betRegion).getByRole("heading", { level: 3, name: betLabel });
  within(betRegion).getByText(positiveNumToCurrencyFormat(amount)!);
});

test(`renders bet section with no amount`, () => {
  const amount = 0;

  render(
    <BetOrWinningsSection seatNumber={1} label={betLabel} amount={amount} />
  );

  expect(screen.queryByRole("region", { name: winningsLabel })).toBeNull();
  expect(
    screen.queryByRole("heading", { level: 3, name: winningsLabel })
  ).toBeNull();

  const betRegion = screen.getByRole("region", { name: betLabel });
  within(betRegion).getByRole("heading", { level: 3, name: betLabel });
  expect(within(betRegion).queryByText("$")).toBeNull();
});

test(`renders winnings section with positive amount`, () => {
  const amount = 1384.21;

  render(
    <BetOrWinningsSection
      seatNumber={1}
      label={winningsLabel}
      amount={amount}
    />
  );

  expect(screen.queryByRole("region", { name: betLabel })).toBeNull();
  expect(
    screen.queryByRole("heading", { level: 3, name: betLabel })
  ).toBeNull();

  const betRegion = screen.getByRole("region", { name: winningsLabel });
  within(betRegion).getByRole("heading", { level: 3, name: winningsLabel });
  within(betRegion).getByText(positiveNumToCurrencyFormat(amount)!);
});

test(`renders winnings section with no amount`, () => {
  const amount = 0;

  render(
    <BetOrWinningsSection
      seatNumber={1}
      label={winningsLabel}
      amount={amount}
    />
  );

  expect(screen.queryByRole("region", { name: betLabel })).toBeNull();
  expect(
    screen.queryByRole("heading", { level: 3, name: betLabel })
  ).toBeNull();

  const betRegion = screen.getByRole("region", { name: winningsLabel });
  within(betRegion).getByRole("heading", { level: 3, name: winningsLabel });
  expect(within(betRegion).queryByText("$")).toBeNull();
});
