import { render, screen } from "@testing-library/react";
import { deck } from "../../card-utils";
import PlayingCard, {
  getVisibleCardLabel,
  hiddenCardLabel,
} from "./PlayingCard";

test("renders hidden", () => {
  render(<PlayingCard />);
  screen.getByRole("generic", { name: hiddenCardLabel });
});
test.each(deck())(`renders visible $rank$suitChar`, (card) => {
  render(<PlayingCard visible={card} />);
  screen.getByRole("generic", { name: getVisibleCardLabel(card) });
});
