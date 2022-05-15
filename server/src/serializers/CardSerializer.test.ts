import { CardSuit, CardRank } from "@chevtek/poker-engine";
import CardFixtures from "../__fixtures__/poker-engine/Card.fixture";
import { asJestCasesTable } from "../__fixtures__/TestCaseUtils";
import { serialize, deserialize } from "./CardSerializer";

const cardCases = asJestCasesTable(CardFixtures);

describe("serialize produces valid JSON when given Card", () => {
  test.each(cardCases)("$description", ({ create }) => {
    const card = create();
    expect(serialize(card)).toMatchSnapshot();
  });
});

describe("deserialize", () => {
  describe("produces valid Card when given serialized version of Card", () => {
    test.each(cardCases)("$description", ({ create }) => {
      const card = create();
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
