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

  const cardRegion = screen.getByRole("region", { name: label });
  within(cardRegion).getByRole("heading", { level: 3, name: label });
});
