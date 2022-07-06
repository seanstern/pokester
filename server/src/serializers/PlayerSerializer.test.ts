import { Card, CardRank, CardSuit, Player, Table } from "@chevtek/poker-engine";
import { serialize as serializeCard } from "./CardSerializer";
import { serialize, createDeserializeFn } from "./PlayerSerializer";

const t = new Table();
test("serialize produces valid JSON when given Player", () => {
  const p = new Player("someId", 3252, t);
  expect(serialize(p)).toStrictEqual({
    id: "someId",
    stackSize: 3252,
    bet: 0,
    folded: false,
    showCards: false,
    left: false,
  });

  p.raise = 13;
  p.holeCards = [
    new Card(CardRank.KING, CardSuit.DIAMOND),
    new Card(CardRank.QUEEN, CardSuit.HEART),
  ];

  expect(serialize(p)).toStrictEqual({
    id: "someId",
    stackSize: 3252,
    bet: 0,
    folded: false,
    showCards: false,
    left: false,
    raise: 13,
    holeCards: p.holeCards.map((card) => serializeCard(card)),
  });
});

describe("createDeserializeFn's created deserialize fn", () => {
  const deserialize = createDeserializeFn(t);

  describe("succeeds", () => {
    describe("by constructing new Player", () => {
      test("when given serialized version of Player with no mutableContext", () => {
        const player = new Player("playerId", 2360, t);

        const deserializedPlayer0 = deserialize(serialize(player));

        expect(deserializedPlayer0).not.toBe(player);
        expect(deserializedPlayer0).toStrictEqual(player);

        player.raise = 13;
        player.holeCards = [
          new Card(CardRank.KING, CardSuit.DIAMOND),
          new Card(CardRank.QUEEN, CardSuit.HEART),
        ];

        const deserializedPlayer1 = deserialize(serialize(player));
        expect(deserializedPlayer1).not.toBe(player);
        expect(deserializedPlayer1).toStrictEqual(player);
      });

      test("when given serialized version of Player with no corresponding entry in mutableContext", () => {
        const player = new Player("playerId", 2360, t);
        const mutableContext = new Map<string, Player>();

        const deserializedPlayer0 = deserialize(
          serialize(player),
          mutableContext
        );

        expect(deserializedPlayer0).not.toBe(player);
        expect(deserializedPlayer0).toStrictEqual(player);
        expect(mutableContext.size).toBe(1);
        expect([...mutableContext.entries()]).toStrictEqual([
          [deserializedPlayer0.id, deserializedPlayer0],
        ]);
      });
    });

    test("by returning existing Player reference when corresponding entry in mutableContext exists", () => {
      const player = new Player("playerId", 2360, t);
      const mutableContext = new Map<string, Player>();
      mutableContext.set(player.id, player);

      const deserializedPlayer0 = deserialize(
        serialize(player),
        mutableContext
      );
      expect(deserializedPlayer0).toBe(player);
      expect(mutableContext.size).toBe(1);
      expect([...mutableContext.entries()]).toStrictEqual([
        [player.id, player],
      ]);
    });
  });

  test("throws when given serialized Player with invalid number of hole cards", () => {
    const serializedPlayer = serialize(new Player("playerId", 2245, t));
    (serializedPlayer as any).holeCards = [
      serializeCard(new Card(CardRank.KING, CardSuit.DIAMOND)),
    ];

    expect(() => deserialize(serializedPlayer)).toThrow(
      /tuple.*length 2[^]*holeCards/
    );
  });
});
