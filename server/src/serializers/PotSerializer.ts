import { Pot, Player } from "@chevtek/poker-engine";
import {
  FieldDeserializationSpec,
  createDeserializeFieldsFn,
  deserializeNumber,
  Deserialize,
  JSONValue,
  createDeserializeArrayFn,
  createDeserializeOptionalFn,
  serialize as serializeCommon,
  assignDeserializedFieldsTo,
} from "./CommonSerializer";
import { createDeserializeReferenceFn as createDeserializePlayerReferenceFn } from "./PlayerSerializer";

/**
 * Given a Pot, returns a JSON conformant version of the Pot
 * @param p a Pot
 * @returns a JSON conformant version of the Pot
 */
export const serialize = (p: Pot) => serializeCommon(p, "table");

type DeserializableFields = "amount" | "eligiblePlayers" | "winners";
/**
 * Given a list of Players, return a function that will deserialize a
 * JSON representation of a Pot.
 * @param players the deserialized Players sitting at the table
 * @returns a function that will deserialize a JSON representation of a Pot;
 *   function takes a JSONValue and returns a Pot
 */
export const createDeserializeFn = (
  players: (Player | null)[]
): Deserialize<Pot> => (json: JSONValue) => {
  const deserializeArrayOfPlayerRefs = createDeserializeArrayFn(
    createDeserializePlayerReferenceFn(players)
  );
  const fieldDeserializationSpec: FieldDeserializationSpec<
    Pot,
    DeserializableFields
  > = {
    amount: deserializeNumber,
    eligiblePlayers: deserializeArrayOfPlayerRefs,
    winners: createDeserializeOptionalFn(deserializeArrayOfPlayerRefs),
  };
  const deserializeFields = createDeserializeFieldsFn(fieldDeserializationSpec);
  return assignDeserializedFieldsTo(new Pot(), deserializeFields(json));
};
