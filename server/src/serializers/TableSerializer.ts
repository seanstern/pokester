import { Table, BettingRound, Player } from "@chevtek/poker-engine";
import {
  createDeserializeArgumentsFn,
  Deserialize,
  deserializeBoolean,
  createDeserializeArrayFn,
  deserializeNumber,
  JSONValue,
  createDeserializeFieldsFn,
  createDeserializeOptionalFn,
  createDeserializeNullableFn,
  serialize as serializeCommon,
  assignDeserializedFieldsTo,
} from "./CommonSerializer";
import { deserialize as deserializeCard } from "./CardSerializer";
import {
  createDeserializeFn as createPlayerDeserializeFn,
  MutableContext as PlayerMutableContext,
} from "./PlayerSerializer";
import { createDeserializeFn as createDeserializePotFn } from "./PotSerializer";

/**
 * Given a Table, returns a JSON conformant version of the Table
 * @param t a Table
 * @returns a JSON conformant version of the Table
 */
export const serialize = (t: Table) => serializeCommon(t, "table");

const deserializeArgs = createDeserializeArgumentsFn<
  ConstructorParameters<typeof Table>
>([
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
]);

/**
 * Given a JSONValue, returns true when it represent a BettingRound and false
 * otherwise
 *
 * @param json a JSONValue
 * @returns true when json is a BettingRound, false otherwise
 */
const isBettingRound = (json: JSONValue): json is BettingRound =>
  typeof json === "string" &&
  Object.values<string>(BettingRound).includes(json);

const deserializeArrayOfCards = createDeserializeArrayFn(deserializeCard);

const deserializeOptionalNumber =
  createDeserializeOptionalFn(deserializeNumber);

const deserializeOptionalBettingRound = createDeserializeOptionalFn(
  (jsonValue: JSONValue) => {
    if (!isBettingRound(jsonValue)) {
      throw new Error("Cannot deserialize JSON that is not BettingRound");
    }
    return jsonValue;
  }
);

/**
 * Given a JSON represenation of a Table, returns a Table.
 *
 * @param json a JSON representation of a Table
 * @returns a Table
 */
export const deserialize: Deserialize<Table, PlayerMutableContext> = (
  json: JSONValue
) => {
  const t = new Table(...deserializeArgs(json));

  const deserializeFields = createDeserializeFieldsFn<
    Table,
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
    | "smallBlindPosition"
    | "pots"
    | "winners",
    PlayerMutableContext
  >({
    autoMoveDealer: deserializeBoolean,
    bigBlindPosition: deserializeOptionalNumber,
    communityCards: deserializeArrayOfCards,
    currentBet: deserializeOptionalNumber,
    currentPosition: deserializeOptionalNumber,
    currentRound: deserializeOptionalBettingRound,
    dealerPosition: deserializeOptionalNumber,
    debug: deserializeBoolean,
    deck: deserializeArrayOfCards,
    handNumber: deserializeNumber,
    lastPosition: deserializeOptionalNumber,
    lastRaise: deserializeOptionalNumber,
    players: createDeserializeArrayFn(
      createDeserializeNullableFn(createPlayerDeserializeFn(t))
    ),
    smallBlindPosition: deserializeOptionalNumber,
    pots: createDeserializeArrayFn(createDeserializePotFn(t)),
    winners: createDeserializeOptionalFn(
      createDeserializeArrayFn(createPlayerDeserializeFn(t))
    ),
  });

  const fields = deserializeFields(json, new Map<string, Player>());

  return assignDeserializedFieldsTo(t, fields);
};
