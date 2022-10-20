import { PokerRooms } from "@pokester/common-api";

const suitChars = ["♣", "♦", "♥", "♠"] as ["♣", "♦", "♥", "♠"];

/**
 * Returns a sorted deck of cards.
 *
 * @returns a sorted deck of cards.
 */
const deck = (): PokerRooms.Get.Card[] =>
  Object.values(PokerRooms.Get.CardRank).flatMap((rank) =>
    Object.values(suitChars).map((suitChar) => ({
      rank: rank,
      suitChar: suitChar,
      suit:
        suitChar === "♣"
          ? PokerRooms.Get.CardSuit.CLUB
          : suitChar === "♦"
          ? PokerRooms.Get.CardSuit.DIAMOND
          : suitChar === "♥"
          ? PokerRooms.Get.CardSuit.HEART
          : PokerRooms.Get.CardSuit.SPADE,
      color: ["♦", "♥"].includes(suitChar)
        ? PokerRooms.Get.CardColor.RED
        : PokerRooms.Get.CardColor.BLACK,
    }))
  );

/**
 * Returns a shuffled deck of cards.
 *
 * @returns a shuffled deck of cards.
 */
export const shuffledDeck = () =>
  deck()
    .map((c) => ({ ...c, comparator: Math.random() }))
    .sort((a, b) => a.comparator - b.comparator);

export default deck;
