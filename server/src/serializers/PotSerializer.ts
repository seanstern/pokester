import { Pot, Table } from "@chevtek/poker-engine";
import {
  createDeserializeFieldsFn,
  deserializeNumber,
  Deserialize,
  JSONValue,
  createDeserializeArrayFn,
  createDeserializeOptionalFn,
  serialize as serializeCommon,
  assignDeserializedFieldsTo,
} from "./CommonSerializer";
import {
  createDeserializeFn as createDeserializePlayerFn,
  MutableContext as PlayerMutableContext,
} from "./PlayerSerializer";

/**
 * Given a Pot, returns a JSON conformant version of the Pot
 *
 * @param p a Pot
 * @returns a JSON conformant version of the Pot
 */
export const serialize = (p: Pot) => serializeCommon(p, "table");

/**
 * Given a Table, return a function that will deserialize a JSON representation
 * of a Pot.
 *
 * @param t the deserialized Table the Players are sitting at
 * @returns a function that will deserialize a JSON representation of a Pot;
 *   function takes a JSONValue and an optional mutableContext, and returns a
 *   Pot
 */
export const createDeserializeFn =
  (t: Table): Deserialize<Pot, PlayerMutableContext> =>
  (json: JSONValue, mutableContext?: PlayerMutableContext) => {
    const deserializePlayers = createDeserializeArrayFn(
      createDeserializePlayerFn(t)
    );

    const deserializeFields = createDeserializeFieldsFn<
      Pot,
      "amount" | "eligiblePlayers" | "winners",
      PlayerMutableContext
    >({
      amount: deserializeNumber,
      eligiblePlayers: deserializePlayers,
      winners: createDeserializeOptionalFn(deserializePlayers),
    });

    return assignDeserializedFieldsTo(
      new Pot(),
      deserializeFields(json, mutableContext)
    );
  };
