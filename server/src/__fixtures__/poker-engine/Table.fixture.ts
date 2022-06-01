import { Table, Card, CardSuit, CardRank } from "@chevtek/poker-engine";
import { Fixture } from "../TypeUtils";

/**
 * Returns a new deck with card ordered deterministically.
 *
 * Deterministic deck cration enables snapshot testing of
 * Table fixtures.
 *
 * @return a new deck with cards ordered deterministically
 */
const deterministicNewDeck: Table["newDeck"] = () => {
  const newDeck: Card[] = [];
  Object.keys(CardSuit).forEach((suit) => {
    Object.keys(CardRank).forEach((rank) => {
      newDeck.push(
        new Card(
          CardRank[rank as keyof typeof CardRank],
          CardSuit[suit as keyof typeof CardSuit]
        )
      );
    });
  });
  return newDeck;
};

export const emptyTable: Fixture<Table> = {
  description: "newly constructed empty Table",
  create: () => new Table(),
};

export const playersSeated: Fixture<Table> = {
  description: "Table with seated players",
  create: () => {
    const t = emptyTable.create();
    t.sitDown("John", 2000, 3);
    t.sitDown("Jane", 3000, 0);
    t.sitDown("Juan", 9199);
    t.sitDown("Jay", 31415, 7);
    return t;
  },
};

export const preFlop: Fixture<Table> = {
  description: "Table at start of pre-flop",
  create: () => {
    const t = playersSeated.create();
    // Shadow newDeck in object with deterministic version
    t.newDeck = deterministicNewDeck;
    t.dealCards();
    // Remove newDeck deterministic shadown from object *only*
    // newDeck continues to exist in Object.getPrototypeOf(t)
    delete (t as any).newDeck;
    return t;
  },
};

export const flop: Fixture<Table> = {
  description: "Table at start of flop; players have: called, checked",
  create: () => {
    const t = preFlop.create();
    t.currentActor!.callAction();
    t.currentActor!.callAction();
    t.currentActor!.callAction();
    t.currentActor!.checkAction();
    return t;
  },
};

export const turn: Fixture<Table> = {
  description:
    "Table at start of turn; players have: called, checked, stoodUp, bet, folded",
  create: () => {
    const t = flop.create();
    t.standUp("Jay");
    t.currentActor!.betAction(50);
    t.currentActor!.foldAction();
    t.currentActor!.callAction();
    return t;
  },
};

export const river: Fixture<Table> = {
  description:
    "Table at start of river; players have called, checked, stoodUp, bet, folded, raised",
  create: () => {
    const t = turn.create();
    t.currentActor!.checkAction();
    t.currentActor!.betAction(50);
    t.currentActor!.raiseAction(100);
    t.currentActor!.callAction();
    return t;
  },
};

export const completeRound: Fixture<Table> = {
  description:
    "Table at completion of round; players have called, checked, stoodUp, bet, folded, raised",
  create: () => {
    const t = river.create();
    t.currentActor!.checkAction();
    t.currentActor!.checkAction();
    return t;
  },
};

export const roundTwo: Fixture<Table> = {
  description: "Table at start of second round",
  create: () => {
    const t = completeRound.create();
    // Shadow newDeck in object with deterministic version
    t.newDeck = deterministicNewDeck;
    t.dealCards();
    // Remove newDeck deterministic shadown from object *only*
    // newDeck continues to exist in Object.getPrototypeOf(t)
    delete (t as any).newDeck;
    return t;
  },
};
