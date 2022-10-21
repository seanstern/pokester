import { render, screen } from "@testing-library/react";
import { deck } from "../../card-utils";
import PlayingCard, {
  getVisibleCardLabel,
  hiddenCardLabel,
} from "./PlayingCard";

test("renders hidden", async () => {
  render(<PlayingCard />);
  await screen.findByRole("generic", { name: hiddenCardLabel });
});
test.each(deck())(`renders visible $rank$suitChar`, async (card) => {
  render(<PlayingCard visible={card} />);
  await screen.findByRole("generic", { name: getVisibleCardLabel(card) });
});
