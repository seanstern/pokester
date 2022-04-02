import { CardSuit, CardRank, Card } from "@chevtek/poker-engine";
import { serialize } from "./CommonSerializer";
import { deserialize } from "./CardSerializer";

const cardSuits = Object.values(CardSuit);
const cardRanks = Object.values(CardRank);
const allCardsTable = cardSuits.flatMap((cardSuit) =>
  cardRanks.map((cardRank) => [cardRank, cardSuit] as [CardRank, CardSuit])
);
describe("deserialize", () => {
  describe("produces valid Card when given serialized version of Card", () => {
    test.each(allCardsTable)("%s of %s", (cardRank, cardSuit) => {
      const card = new Card(cardRank, cardSuit);
      const serializedCard = serialize(card);
      const deserializedCard = deserialize(serializedCard);
      expect(deserializedCard).not.toBe(card);
      expect(deserializedCard).toStrictEqual(card);
    });
  });

  describe("throws when given", () => {
    test("serialized Card with invalid rank", () => {
      expect(() =>
        deserialize({ _rank: "badrank", _suit: CardSuit.CLUB })
      ).toThrow(/CardRank[^]*_rank/);
    });

    test("serialized Card with invalid suit", () => {
      expect(() =>
        deserialize({ _rank: CardRank.EIGHT, _suit: "badsuit" })
      ).toThrow(/CardSuit[^]*_suit/);
    });
  });
});
