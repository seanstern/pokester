import { Card, CardRank, CardSuit, Player, Table } from "@chevtek/poker-engine";
import { serialize as serializeCard } from "./CardSerializer";
import {
  serialize,
  createDeserializeFn,
  createDeserializeReferenceFn,
} from "./PlayerSerializer";

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
    holeCards: [
      serializeCard(new Card(CardRank.KING, CardSuit.DIAMOND)),
      serializeCard(new Card(CardRank.QUEEN, CardSuit.HEART)),
    ],
  });
});

describe("createDeserializeFn's created deserialize fn", () => {
  const deserialize = createDeserializeFn(t);

  test("produces valid Player when given serialized version of Player", () => {
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

  describe("throws when given", () => {
    test("serialized Player with invalid number of hole cards", () => {
      const serializedPlayer = serialize(new Player("playerId", 2245, t));
      (serializedPlayer as any).holeCards = [
        serializeCard(new Card(CardRank.KING, CardSuit.DIAMOND)),
      ];

      expect(() => deserialize(serializedPlayer)).toThrow(
        /tuple.*length 2[^]*holeCards/
      );
    });
  });
});

describe("createDeserializeReferenceFn's created deserializeReference fn", () => {
  const players = [
    new Player("player id 0", 1000, t),
    new Player("player id 1", 2000, t),
    new Player("player id 2", 3000, t),
  ];
  const deserializeReference = createDeserializeReferenceFn(players);

  describe("produces valid reference to deserialized Player object when given valid serialized reference", () => {
    const validSerializedPlayerReferencesTable = players.map((player) => ({
      serializedPlayerReference: { id: player.id },
      player,
    }));
    test.each(validSerializedPlayerReferencesTable)(
      '{ id: "$id" }',
      ({ serializedPlayerReference, player }) => {
        expect(deserializeReference(serializedPlayerReference)).toBe(player);
      }
    );
  });

  test("throws when given serialized reference to Player that doesn't exist", () => {
    expect(() =>
      deserializeReference({ id: "non-existent player id" })
    ).toThrow(/reference/);
  });
});
