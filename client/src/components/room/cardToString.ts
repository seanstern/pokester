import { PokerRooms } from "@pokester/common-api";

export type CardString =
  `${PokerRooms.Get.Card["rank"]}${PokerRooms.Get.Card["suitChar"]}`;
/**
 * Given a Card, returns a string representation of the Card (rank and suit).
 * @param card a Card
 * @returns a string represenation of the Card (rank and suit)
 */
const cardToString = (card: PokerRooms.Get.Card): CardString =>
  `${card.rank}${card.suitChar}`;

export default cardToString;
