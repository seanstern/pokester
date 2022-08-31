import * as PokerEngine from "@chevtek/poker-engine";
import {
  Fixture,
  FixtureModule,
  Player as PokerEnginePlayerFixtures,
  Pot as PokerEnginePotFixtures,
  Table as PokerEngineTableFixtures,
} from "@pokester/poker-engine-fixtures";
import mapValues from "lodash/mapValues";
import pick from "lodash/pick";
import startCase from "lodash/startCase";
import transform from "lodash/transform";
import upperFirst from "lodash/upperFirst";
import {
  OpponentPlayer,
  PlayerAction,
  Pot as PotType,
  ResBody as ResBodyType,
  SelfPlayer,
  Table as TableType,
} from "./Types";

// Useful for mapping PokerEngine*Fixtures keys to common-api *Fixtures keys
type CamelCasePrepend<
  T extends string,
  U extends string
> = `${Uncapitalize<T>}${Capitalize<U>}`;

type PokerEnginePlayerFixturesKey = keyof typeof PokerEnginePlayerFixtures;

/**
 * Given a PokerEngine.Player, returns a SelfPlayer
 * @param p a PokerEngine.Player
 * @returns a SelfPlayer
 */
const toSelfPlayer = (p: PokerEngine.Player): SelfPlayer => ({
  ...pick(p, ["bet", "folded", "left", "id", "stackSize", "holeCards"]),
  isSelf: true,
  legalActions: p.legalActions() as PlayerAction[],
});

type SelfPlayerFixturesKey = CamelCasePrepend<
  "self",
  PokerEnginePlayerFixturesKey
>;
const selfPlayerFixtures = transform(
  PokerEnginePlayerFixtures,
  (selfPlayerFixtures, { description, create }, fixtureName) => {
    const key = `self${upperFirst(fixtureName)}` as SelfPlayerFixturesKey;
    selfPlayerFixtures[key] = {
      description,
      create: () => toSelfPlayer(create()),
    };
    return selfPlayerFixtures;
  },
  {} as FixtureModule<SelfPlayer, SelfPlayerFixturesKey>
);

/**
 * Given a PokerEngine.Player, returns an OpponentPlayer
 * @param p a PokerEngine.Player
 * @returns an OpponentPlayer
 */
const toOpponentPlayer = (p: PokerEngine.Player): OpponentPlayer => ({
  ...pick(p, ["bet", "folded", "left", "id", "stackSize"]),
  isSelf: false,
});

type OpponentPlayerFixturesKey = `opponent${Capitalize<
  keyof typeof PokerEnginePlayerFixtures
>}`;
const opponentPlayerFixtures = transform(
  PokerEnginePlayerFixtures,
  (opponentPlayerFixtures, { description, create }, fixtureName) => {
    const key = `opponent${upperFirst(
      fixtureName
    )}` as OpponentPlayerFixturesKey;
    opponentPlayerFixtures[key] = {
      description,
      create: () => toOpponentPlayer(create()),
    };
    return opponentPlayerFixtures;
  },
  {} as FixtureModule<OpponentPlayer, OpponentPlayerFixturesKey>
);

export const Player = {
  ...selfPlayerFixtures,
  ...opponentPlayerFixtures,
};

type PokerEnginePotFixtureKey = keyof typeof PokerEnginePotFixtures;

/**
 * Given a PokerEngine.Pot and an optional indication of wheather any of
 * the players in the pot should be a SelfPlayer, returns a Pot.
 * @param p a PokerEngine.Pot
 * @param includeSelfPlayer an optional boolean or string; when true, the winner
 *   or first eligible player in the Pot is the SelfPlayer; when a string, the
 *   id of the player in the Pot to make the SelfPlayer; otherwise no SelfPlayer
 *   is included in the Pot
 * @returns a Pot
 */
const toPot = (
  p: PokerEngine.Pot,
  includeSelfPlayer?: boolean | string
): PotType => {
  const { amount, eligiblePlayers, winners } = p;
  const selfId =
    typeof includeSelfPlayer === "string"
      ? includeSelfPlayer
      : includeSelfPlayer === true && winners && winners[0]
      ? winners[0].id
      : includeSelfPlayer === true && eligiblePlayers && eligiblePlayers[0]
      ? eligiblePlayers[0].id
      : undefined;

  return {
    amount,
    eligiblePlayers: eligiblePlayers.map((ep) =>
      ep.id === selfId ? toSelfPlayer(ep) : toOpponentPlayer(ep)
    ),
    winners: winners?.map((w) =>
      w.id === selfId ? toSelfPlayer(w) : toOpponentPlayer(w)
    ),
  };
};

type SelfInPotFixturesKey = CamelCasePrepend<
  "selfIn",
  PokerEnginePotFixtureKey
>;
const selfInPotFixtures = transform(
  PokerEnginePotFixtures,
  (selfInPotFixtures, { description, create }, fixtureName) => {
    const key = `selfIn${upperFirst(fixtureName)}` as SelfInPotFixturesKey;
    selfInPotFixtures[key] = {
      description,
      create: () => toPot(create(), true),
    };
    return selfInPotFixtures;
  },
  {} as FixtureModule<PotType, SelfInPotFixturesKey>
);

type OpponentsInPotFixturesKey = CamelCasePrepend<
  "opponentsIn",
  PokerEnginePotFixtureKey
>;
const opponentsInPotFixtures = transform(
  PokerEnginePotFixtures,
  (opponentsInPotFixtures, { description, create }, fixtureName) => {
    const key = `opponentsIn${upperFirst(
      fixtureName
    )}` as OpponentsInPotFixturesKey;
    opponentsInPotFixtures[key] = {
      description,
      create: () => toPot(create(), false),
    };
    return selfInPotFixtures;
  },
  {} as FixtureModule<PotType, OpponentsInPotFixturesKey>
);

export const Pot = {
  ...selfInPotFixtures,
  ...opponentsInPotFixtures,
};

type PokerEngineTableFixturesKey = keyof typeof PokerEngineTableFixtures;

type OpponentsInTableFixturesKey = CamelCasePrepend<
  "opponentsIn",
  PokerEngineTableFixturesKey
>;
const opponentsInTableFixtures = transform(
  PokerEngineTableFixtures,
  (opponentsInTableFixtures, { description, create }, fixtureName) => {
    const pokerEngineTable = create();

    const players = pokerEngineTable.players.map(
      (p) => p && toOpponentPlayer(p)
    );
    const pots = pokerEngineTable.pots.map((p) => toPot(p, false));
    const winners = pokerEngineTable.winners?.map((w) => toOpponentPlayer(w));

    const key = `opponentsIn${upperFirst(
      fixtureName
    )}` as OpponentsInTableFixturesKey;
    opponentsInTableFixtures[key] = {
      description,
      create: () => ({
        ...pick(pokerEngineTable, [
          "bigBlindPosition",
          "currentBet",
          "currentPosition",
          "currentRound",
          "dealerPosition",
          "handNumber",
          "smallBlindPosition",
          "buyIn",
          "smallBlind",
          "bigBlind",
          "communityCards",
        ]),
        players,
        pots,
        winners,
      }),
    };
    return opponentsInPotFixtures;
  },
  {} as FixtureModule<TableType, OpponentsInTableFixturesKey>
);

type SelfInTableFixturesKey = CamelCasePrepend<
  "selfIn",
  PokerEngineTableFixturesKey
>;
const selfInTableFixtures = transform(
  PokerEngineTableFixtures,
  (selfInTableFixtures, { description, create }, fixtureName) => {
    const pokerEngineTable = create();

    const selfPlayerId = (
      pokerEngineTable.winners && pokerEngineTable.winners[0]
        ? pokerEngineTable.winners[0]
        : pokerEngineTable.players.find((p) => p !== null)
    )?.id;

    const players = pokerEngineTable.players.map(
      (p) =>
        p && (p.id === selfPlayerId ? toSelfPlayer(p) : toOpponentPlayer(p))
    );
    const pots = pokerEngineTable.pots.map((p) => toPot(p, selfPlayerId));
    const winners = pokerEngineTable.winners?.map(
      (w) =>
        w && (w.id === selfPlayerId ? toSelfPlayer(w) : toOpponentPlayer(w))
    );

    const key = `selfIn${upperFirst(fixtureName)}` as SelfInTableFixturesKey;
    selfInTableFixtures[key] = {
      description,
      create: () => ({
        ...pick(pokerEngineTable, [
          "bigBlindPosition",
          "currentBet",
          "currentPosition",
          "currentRound",
          "dealerPosition",
          "handNumber",
          "smallBlindPosition",
          "buyIn",
          "smallBlind",
          "bigBlind",
          "communityCards",
        ]),
        players,
        pots,
        winners,
      }),
    };
    return opponentsInPotFixtures;
  },
  {} as FixtureModule<TableType, SelfInTableFixturesKey>
);

export const Table = {
  ...selfInTableFixtures,
  ...opponentsInTableFixtures,
};

export const ResBody = {
  ...mapValues(
    selfInTableFixtures,
    ({ description, create }, key): Fixture<ResBodyType> => {
      return {
        description,
        create: () => ({
          id: key,
          name: startCase(key),
          canSit: false,
          table: create(),
        }),
      };
    }
  ),
  ...mapValues(
    opponentsInTableFixtures,
    ({ description, create }, key): Fixture<ResBodyType> => {
      return {
        description,
        create: () => ({
          id: key,
          name: startCase(key),
          canSit: true,
          table: create(),
        }),
      };
    }
  ),
};
