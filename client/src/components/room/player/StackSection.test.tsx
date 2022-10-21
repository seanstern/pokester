import { render, screen, within } from "@testing-library/react";
import StackSection, { amountToCurrencyFormat, label } from "./StackSection";

test(`renders stack section with positive amount`, () => {
  const amount = 1384.21;

  render(<StackSection amount={amount} />);

  const stackRegion = screen.getByRole("region", { name: label });
  within(stackRegion).getByText(amountToCurrencyFormat(amount));
});

test(`renders stack section with no amount`, () => {
  const amount = 0;

  render(<StackSection amount={amount} />);

  const stackRegion = screen.getByRole("region", { name: label });
  within(stackRegion).getByText(amountToCurrencyFormat(amount));
});
