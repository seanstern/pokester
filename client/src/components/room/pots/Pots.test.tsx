import { PokerRooms } from "@pokester/common-api";
import { render, screen, within } from "@testing-library/react";
import Pots, { potsRegionLabel, sidePotsRegionLabel } from "./Pots";
import toCurrencyFormat from "../toCurrencyFormat";

test("renders with no pots", () => {
  render(<Pots pots={[]} />);

  const potsRegion = screen.getByRole("region", { name: potsRegionLabel });
  within(potsRegion).getByRole("heading", {
    level: 2,
    name: potsRegionLabel,
  });
  within(potsRegion).getByText(toCurrencyFormat(0));

  expect(
    within(potsRegion).queryByRole("region", { name: sidePotsRegionLabel })
  ).toBeNull();
});

describe("renders main pot only", () => {
  test.each(Object.values(PokerRooms.Get.Fixtures.Pot))(
    "$description",
    ({ create }) => {
      const pot = create();

      render(<Pots pots={[pot]} />);

      const potsRegion = screen.getByRole("region", { name: potsRegionLabel });
      within(potsRegion).getByRole("heading", {
        level: 2,
        name: potsRegionLabel,
      });
      within(potsRegion).getByText(toCurrencyFormat(pot.amount));

      expect(
        within(potsRegion).queryByRole("region", { name: sidePotsRegionLabel })
      ).toBeNull();
    }
  );
});

describe("renders main pot with side pots", () => {
  test.each(Object.values(PokerRooms.Get.Fixtures.Pot))(
    "$description",
    ({ create }) => {
      const pot = create();

      render(<Pots pots={[pot, pot, pot]} />);

      const potsRegion = screen.getByRole("region", { name: potsRegionLabel });
      within(potsRegion).getByRole("heading", {
        level: 2,
        name: toCurrencyFormat(pot.amount),
      });

      const sidePotsRegion = within(potsRegion).getByRole("region", {
        name: sidePotsRegionLabel,
      });
      within(sidePotsRegion).getAllByText(toCurrencyFormat(pot.amount), {
        exact: false,
      });
    }
  );
});
