import { Pot, Player, Table } from "@chevtek/poker-engine";
import { serialize as serializePlayer } from "./PlayerSerializer";
import { createDeserializeFn, serialize } from "./PotSerializer";

const t = new Table();
test("serialize produces valid JSON when given Pot", () => {
  const p = new Pot();
  expect(serialize(p)).toStrictEqual({
    amount: 0,
    eligiblePlayers: [],
  });

  const players = [
    new Player("player id 0", 1000, t),
    new Player("player id 1", 2500, t),
  ];

  p.amount = 50;
  p.eligiblePlayers.push(...players);
  p.winners = [players[0]];

  expect(serialize(p)).toStrictEqual({
    amount: 50,
    eligiblePlayers: p.eligiblePlayers.map((player) => serializePlayer(player)),
    winners: p.winners.map((player) => serializePlayer(player)),
  });
});

describe("createDeserializeFn's created deserialize fn", () => {
  const players = [
    new Player("player id 0", 1000, t),
    new Player("player id 1", 2500, t),
    new Player("player id 2", 3500, t),
  ];
  const deserializePot = createDeserializeFn(t);

  const createPotsTable: [string, () => Pot][] = [
    ["with no eligible players, no winners", () => new Pot()],
    [
      "with eligible players, no winners",
      () => {
        const p = new Pot();
        p.eligiblePlayers.push(players[0]);
        return p;
      },
    ],
    [
      "with eligible players, winners",
      () => {
        const p = new Pot();
        p.eligiblePlayers.push(...players);
        p.winners = [players[0]];
        return p;
      },
    ],
  ];

  describe("succeeds by constructing new Pot", () => {
    describe("and new Players when given serialized version of Pot with no mutableContext", () => {
      test.each(createPotsTable)("%s", (_, createPot) => {
        const p = createPot();
        const deserializedPot = deserializePot(serialize(p));
        expect(deserializedPot).not.toBe(p);
        expect(deserializedPot).toStrictEqual(p);
      });
    });

    describe("and new Players when given serialized version of Pot with no corresponding player entries in mutableContext", () => {
      test.each(createPotsTable)("%s", (_, createPot) => {
        const p = createPot();
        const mutableContext = new Map<string, Player>();
        const deserializedPot = deserializePot(serialize(p), mutableContext);
        expect(deserializedPot).not.toBe(p);
        expect(deserializedPot).toStrictEqual(p);
        expect(mutableContext.size).toBe(p.eligiblePlayers.length);
        expect([...mutableContext.entries()]).toStrictEqual(
          p.eligiblePlayers.map((p) => [p.id, p])
        );
      });
    });

    describe("with existing Player references when given serialized version of Pot with corresponding player entries in mutableContext", () => {
      test.each(createPotsTable)("%s", (_, createPot) => {
        const p = createPot();
        const mutableContext = new Map<string, Player>();
        p.eligiblePlayers.forEach((p) => mutableContext.set(p.id, p));
        const deserializedPot = deserializePot(serialize(p), mutableContext);
        expect(deserializedPot).not.toBe(p);
        expect(deserializedPot).toStrictEqual(p);
        expect(mutableContext.size).toBe(p.eligiblePlayers.length);
        expect([...mutableContext.entries()]).toStrictEqual(
          p.eligiblePlayers.map((p) => [p.id, p])
        );
      });
    });
  });
});
