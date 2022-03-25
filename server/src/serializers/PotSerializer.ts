import { Pot, Table, Player } from "@chevtek/poker-engine";
import {
  FieldDeserializationSpec,
  createDeserializeFieldsFn,
  deserializeNumber,
  Deserialize,
  JSONValue,
  createDeserializeArrayFn,
  createOptionalDeserializeFn,
} from "./CommonSerializer";
import { createRefDeserializeFn as createPlayerRefDeserializeFn } from "./PlayerSerializer";

type DeserializableFields = "amount" | "eligiblePlayers" | "winners";
/**
 * Given a list of Players, return a function that will deserialize a
 * JSON representation of a Pot.
 * @param t the deserialized Players sitting at the table
 * @returns a function that will deserialize a JSON representation of a Pot;
 *   function takes a JSONValue and returns a Pot
 */
export const createDeserializeFn = (
  players: (Player | null)[]
): Deserialize<Pot> => (json: JSONValue) => {
  const deserializeArrayOfPlayerRefs = createDeserializeArrayFn(
    createPlayerRefDeserializeFn(players)
  );
  const fieldDeserializationSpec: FieldDeserializationSpec<
    Pot,
    DeserializableFields
  > = {
    amount: deserializeNumber,
    eligiblePlayers: deserializeArrayOfPlayerRefs,
    winners: createOptionalDeserializeFn(deserializeArrayOfPlayerRefs),
  };
  const deserializeFields = createDeserializeFieldsFn(fieldDeserializationSpec);
  const { amount, eligiblePlayers, winners } = deserializeFields(json);
  const p = new Pot();
  p.amount = amount;
  p.eligiblePlayers = eligiblePlayers;
  p.winners = winners;
  return p;
};
