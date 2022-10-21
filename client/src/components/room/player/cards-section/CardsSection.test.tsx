import { render, screen, within } from "@testing-library/react";
import CardsSection, { label } from "./CardsSection";

test(`renders labeled region with header`, () => {
  render(
    <CardsSection
      seatNumber={1}
      roundInProgress
      winner
      folded
      holeCards={undefined}
    />
  );
  screen.getByRole("region", { name: label });
  within(screen.getByRole("heading", { level: 3, name: label }));
});
