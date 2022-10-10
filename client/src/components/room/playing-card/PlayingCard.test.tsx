import { PokerRooms } from "@pokester/common-api";
import { render, screen } from "@testing-library/react";
import PlayingCard from "./PlayingCard";

test("renders A♣ with default size", () => {
  const value = "A♣";
  const color = PokerRooms.Get.CardColor.BLACK;

  render(<PlayingCard value={value} color={color} />);

  screen.getByText(value);
});

test("renders 2♥ with sm size", () => {
  const value = "2♥";
  const color = PokerRooms.Get.CardColor.RED;

  render(<PlayingCard value={value} color={color} size="sm" />);

  screen.getByText(value);
});

test("renders T♦ with lg size", () => {
  const value = "T♦";
  const color = PokerRooms.Get.CardColor.RED;

  render(<PlayingCard value={value} color={color} size="lg" />);

  screen.getByText(value);
});
