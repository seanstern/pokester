import { Table, BettingRound } from "@chevtek/poker-engine";
import {
  ArgumentsDeserializationSpec,
  createDeserializeArgumentsFn,
  FieldDeserializationSpec,
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
  createDeserializeReferenceFn as createDeserializePlayerReferenceFn,
} from "./PlayerSerializer";
import { createDeserializeFn as createDeserializePotFn } from "./PotSerializer";

/**
 * Given a Table, returns a JSON conformant version of the Table
 * @param t a Table
 * @returns a JSON conformant version of the Table
 */
export const serialize = (t: Table) => serializeCommon(t, "table");

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
const deserializeArgs = createDeserializeArgumentsFn(
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
  const deserializeOptionalNumber = createDeserializeOptionalFn(
    deserializeNumber
  );
  const deserializeArrayOfNullablePlayers = createDeserializeArrayFn(
    createDeserializeNullableFn(createPlayerDeserializeFn(t))
  );
  const fieldDeserializationSpec: FieldDeserializationSpec<
    Table,
    DeserializableFields
  > = {
    autoMoveDealer: deserializeBoolean,
    bigBlindPosition: deserializeOptionalNumber,
    communityCards: deserializeArrayOfCards,
    currentBet: deserializeOptionalNumber,
    currentPosition: deserializeOptionalNumber,
    currentRound: createDeserializeOptionalFn((jsonValue: JSONValue) => {
      if (!isBettingRound(jsonValue)) {
        throw new Error("Cannot deserialize JSON that is not BettingRound");
      }
      return jsonValue;
    }),
    dealerPosition: deserializeOptionalNumber,
    debug: deserializeBoolean,
    deck: deserializeArrayOfCards,
    handNumber: deserializeNumber,
    lastPosition: deserializeOptionalNumber,
    lastRaise: deserializeOptionalNumber,
    players: deserializeArrayOfNullablePlayers,
    smallBlindPosition: deserializeOptionalNumber,
  };
  const deserializeFields = createDeserializeFieldsFn(fieldDeserializationSpec);
  const fields = deserializeFields(json);

  const { players } = fields;
  const refFieldDeserializationSpec: FieldDeserializationSpec<
    Table,
    "pots" | "winners"
  > = {
    pots: createDeserializeArrayFn(createDeserializePotFn(players)),
    winners: createDeserializeOptionalFn(
      createDeserializeArrayFn(createDeserializePlayerReferenceFn(players))
    ),
  };
  const deserializeRefFields = createDeserializeFieldsFn(
    refFieldDeserializationSpec
  );
  const refFields = deserializeRefFields(json);

  const allFields = { ...fields, ...refFields };

  return assignDeserializedFieldsTo(t, allFields);
};
