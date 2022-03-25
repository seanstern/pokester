import { Table, BettingRound } from "@chevtek/poker-engine";
import {
  ArgumentsDeserializationSpec,
  creatDeserializeArgumentsFn,
  FieldDeserializationSpec,
  Deserialize,
  deserializeBoolean,
  createDeserializeArrayFn,
  deserializeNumber,
  JSONValue,
  createDeserializeFieldsFn,
} from "./CommonSerializer";
import { deserialize as deserializeCard } from "./CardSerializer";
import {
  createDeserializeFn as createPlayerDeserializeFn,
  createRefDeserializeFn as createPlayerRefDeserializeFn,
} from "./PlayerSerializer";
import { createDeserializeFn as createPotDeserialzeFn } from "./PotSerializer";

const constructorArgumentsDeserializationSpec: ArgumentsDeserializationSpec<
  ConstructorParameters<typeof Table>
> = [
  {
    serializedKeyName: "buyIn",
    deserialize: (jsonValue) => jsonValue as number,
  },
  {
    serializedKeyName: "smallBlind",
    deserialize: (jsonValue) => jsonValue as number,
  },
  {
    serializedKeyName: "bigBlind",
    deserialize: (jsonValue) => jsonValue as number,
  },
];
const deserializeArgs = creatDeserializeArgumentsFn(
  constructorArgumentsDeserializationSpec
);

/**
 * Given a JSONValue, returns true when it represent a BettingRound
 * and false otherwise
 * @param json a JSONValue
 * @returns true when json is a BettingRound, false otherwise
 */
const isBettingRound = (json: JSONValue): json is BettingRound =>
  typeof json === "string" &&
  Object.values<string>(BettingRound).includes(json);

const deserializeArrayOfCards = createDeserializeArrayFn(deserializeCard);

type DeserializableFields =
  | "autoMoveDealer"
  | "bigBlindPosition"
  | "communityCards"
  | "currentBet"
  | "currentPosition"
  | "currentRound"
  | "dealerPosition"
  | "debug"
  | "deck"
  | "handNumber"
  | "lastPosition"
  | "lastRaise"
  | "players"
  | "smallBlindPosition";
/**
 * Given a JSON represenation of a Table, returns a Table.
 * @param json a JSON representation of a Table
 * @returns a Table
 */
export const deserialize: Deserialize<Table> = (json: JSONValue) => {
  const t = new Table(...deserializeArgs(json));
  const deserializePlayerArray = createDeserializeArrayFn(
    createPlayerDeserializeFn(t)
  );
  const fieldDeserializationSpec: FieldDeserializationSpec<
    Table,
    DeserializableFields
  > = {
    autoMoveDealer: deserializeBoolean,
    bigBlindPosition: deserializeNumber,
    communityCards: deserializeArrayOfCards,
    currentBet: deserializeNumber,
    currentPosition: deserializeNumber,
    currentRound: (jsonValue) => {
      if (!isBettingRound(jsonValue)) {
        throw new Error(
          "Cannot deserialize argument with serializeKeyName 'currentRound' from JSON that is not BettingRound"
        );
      }
      return jsonValue;
    },
    dealerPosition: deserializeNumber,
    debug: deserializeBoolean,
    deck: deserializeArrayOfCards,
    handNumber: deserializeNumber,
    lastPosition: deserializeNumber,
    lastRaise: deserializeNumber,
    players: deserializePlayerArray,
    smallBlindPosition: deserializeNumber,
  };
  const deserializeFields = createDeserializeFieldsFn(fieldDeserializationSpec);
  const {
    autoMoveDealer,
    bigBlindPosition,
    communityCards,
    currentBet,
    currentPosition,
    currentRound,
    dealerPosition,
    debug,
    deck,
    handNumber,
    lastPosition,
    lastRaise,
    players,

    smallBlindPosition,
  } = deserializeFields(json);

  const refFieldDeserializationSpec: FieldDeserializationSpec<
    Table,
    "pots" | "winners"
  > = {
    pots: createDeserializeArrayFn(createPotDeserialzeFn(players)),
    winners: createDeserializeArrayFn(createPlayerRefDeserializeFn(players)),
  };
  const deserializeRefField = createDeserializeFieldsFn(
    refFieldDeserializationSpec
  );
  const { pots, winners } = deserializeRefField(json);

  t.autoMoveDealer = autoMoveDealer;
  t.bigBlindPosition = bigBlindPosition;
  t.communityCards = communityCards;
  t.currentBet = currentBet;
  t.currentPosition = currentPosition;
  t.currentRound = currentRound;
  t.dealerPosition = dealerPosition;
  t.debug = debug;
  t.deck = deck;
  t.handNumber = handNumber;
  t.lastPosition = lastPosition;
  t.lastRaise = lastRaise;
  t.players = players;
  t.pots = pots;
  t.smallBlindPosition = smallBlindPosition;
  t.winners = winners;
  return t;
};
