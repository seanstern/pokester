import { Table, BettingRound } from "@chevtek/poker-engine";
import { deserialize, serialize } from "./TableSerializer";

test("serialize produces valid JSON when given Table", () => {
  const t = new Table();
  expect(serialize(t)).toStrictEqual({
    buyIn: 1000,
    smallBlind: 5,
    bigBlind: 10,
    autoMoveDealer: true,
    communityCards: [],
    debug: false,
    deck: [],
    handNumber: 0,
    players: [null, null, null, null, null, null, null, null, null, null],
    pots: [],
  });

  t.bigBlindPosition = 1;
  t.currentBet = 50;
  t.currentPosition = 2;
  t.currentRound = BettingRound.FLOP;
  t.dealerPosition = 1;
  t.lastPosition = 3;
  t.lastRaise = 100;
  t.smallBlindPosition = 0;
  t.winners = [];
  expect(serialize(t)).toStrictEqual({
    buyIn: 1000,
    smallBlind: 5,
    bigBlind: 10,
    autoMoveDealer: true,
    communityCards: [],
    debug: false,
    deck: [],
    handNumber: 0,
    players: [null, null, null, null, null, null, null, null, null, null],
    pots: [],
    bigBlindPosition: 1,
    currentBet: 50,
    currentPosition: 2,
    currentRound: BettingRound.FLOP,
    dealerPosition: 1,
    lastPosition: 3,
    lastRaise: 100,
    smallBlindPosition: 0,
    winners: [],
  });
});

describe("deserialize", () => {
  test("produces valid Table when given serialized version of Table", () => {
    const t = new Table();

    const deserializedTable0 = deserialize(serialize(t));
    expect(deserializedTable0).not.toBe(t);
    expect(deserializedTable0).toStrictEqual(t);

    t.sitDown("John", 2000, 3);
    t.sitDown("Jane", 3000, 0);
    t.sitDown("Juan", 9199);
    t.sitDown("Jay", 31415, 7);

    const deserializedTable1 = deserialize(serialize(t));
    expect(deserializedTable1).not.toBe(t);
    expect(deserializedTable1).toStrictEqual(t);

    t.dealCards();
    t.currentActor!.callAction();
    t.currentActor!.callAction();
    t.currentActor!.callAction();
    t.currentActor!.checkAction();

    const deserializedTable2 = deserialize(serialize(t));
    expect(deserializedTable2).not.toBe(t);
    expect(deserializedTable2).toStrictEqual(t);

    t.standUp("Jay");
    t.currentActor!.betAction(50);
    t.currentActor!.foldAction();
    t.currentActor!.callAction();

    const deserializedTable3 = deserialize(serialize(t));
    expect(deserializedTable3).not.toBe(t);
    expect(deserializedTable3).toStrictEqual(t);

    t.currentActor!.checkAction();
    t.currentActor!.betAction(50);
    t.currentActor!.raiseAction(100);
    t.currentActor!.callAction();

    const deserializedTable4 = deserialize(serialize(t));
    expect(deserializedTable4).not.toBe(t);
    expect(deserializedTable4).toStrictEqual(t);

    t.currentActor!.checkAction();
    t.currentActor!.checkAction();

    const deserializedTable5 = deserialize(serialize(t));
    expect(deserializedTable5).not.toBe(t);
    expect(deserializedTable5).toStrictEqual(t);
  });

  test("throws when given Table with invalid current round", () => {
    const serializedTable = serialize(new Table());
    (serializedTable as any).currentRound = "not a betting round";

    expect(() => deserialize(serializedTable)).toThrow(
      /BettingRound[^]*currentRound/
    );
  });
});
