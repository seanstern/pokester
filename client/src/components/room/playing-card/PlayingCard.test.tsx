import { PokerRooms } from "@pokester/common-api";
import { render, screen } from "@testing-library/react";
import PlayingCard from "./PlayingCard";

test("renders A♣", () => {
  const value = "A♣";
  const color = PokerRooms.Get.CardColor.BLACK;

  render(<PlayingCard value={value} color={color} />);

  screen.getByText(value);
});
