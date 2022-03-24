import { Pot, Table } from "@chevtek/poker-engine";
import {
  FieldDeserializationSpec,
  createDeserializeFieldsFn,
  deserializeNumber,
  Deserialize,
  JSONValue,
  createDeserializeArrayFn,
} from "./CommonSerializer";
import { createDeserializeFn as createDeserializePlayerFn } from "./PlayerSerializer";

type DeserializableFields = "amount" | "eligiblePlayers" | "winners";

/**
 * Given a Table, return a function that will deserialize JSON representing
 * a Pot.
 * @param t the deserialized Table the Pot is for
 * @returns a Pot
 */
export const createDeserializeFn = (t: Table): Deserialize<Pot> => (
  json: JSONValue
) => {
  const fieldDeserializationSpec: FieldDeserializationSpec<
    Pot,
    DeserializableFields
  > = {
    amount: deserializeNumber,
    eligiblePlayers: createDeserializeArrayFn(createDeserializePlayerFn(t)),
    winners: createDeserializeArrayFn(createDeserializePlayerFn(t)),
  };
  const deserializeFields = createDeserializeFieldsFn(fieldDeserializationSpec);
  const { amount, eligiblePlayers, winners } = deserializeFields(json);
  const p = new Pot();
  p.amount = amount;
  p.eligiblePlayers = eligiblePlayers;
  p.winners = winners;
  return p;
};
