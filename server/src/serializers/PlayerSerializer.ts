import { Player, Card, Table } from "@chevtek/poker-engine";
import {
  ArgumentsDeserializationSpec,
  creatDeserializeArgumentsFn,
  Deserialize,
  deserializeString,
  deserializeNumber,
  JSONValue,
  FieldDeserializationSpec,
  createDeserializeArrayFn,
  deserializeBoolean,
  createDeserializeFieldsFn,
} from "./CommonSerializer";
import { deserialize as deseralizeCard } from "./CardSerializer";

type OmitLast<T> = T extends [...infer S, any] ? S : never;
const partialConstructorArgumentsDeserializationSpec: ArgumentsDeserializationSpec<
  OmitLast<ConstructorParameters<typeof Player>>
> = [
  {
    serializedKeyName: "id",
    deserialize: deserializeString,
  },
  {
    serializedKeyName: "stackSize",
    deserialize: deserializeNumber,
  },
];
const partialDeserializeConstructorArgs = creatDeserializeArgumentsFn(
  partialConstructorArgumentsDeserializationSpec
);

const deserializeCardArray = createDeserializeArrayFn(deseralizeCard);

type DeserializableFields =
  | "bet"
  | "raise"
  | "holeCards"
  | "folded"
  | "showCards"
  | "left";
const fieldDeserializationSpec: FieldDeserializationSpec<
  Player,
  DeserializableFields
> = {
  bet: deserializeNumber,
  raise: deserializeNumber,
  holeCards: (json: JSONValue) => {
    const cardArray = deserializeCardArray(json);
    if (cardArray.length !== 2) {
      throw new Error("Cannot serialize JSON that is not tuple of length 2");
    }
    return cardArray as [Card, Card];
  },
  folded: deserializeBoolean,
  showCards: deserializeBoolean,
  left: deserializeBoolean,
};

const deserializeFields = createDeserializeFieldsFn(fieldDeserializationSpec);

/**
 * Given a Table, return a function that will deserialize JSON representing
 * a Player.
 * @param t the deserialized Table the Players are sitting at
 * @returns a Player
 */
export const createDeserializeFn = (t: Table): Deserialize<Player> => (
  json: JSONValue
) => {
  const p = new Player(...partialDeserializeConstructorArgs(json), t);
  const { bet, raise, holeCards, folded, showCards, left } = deserializeFields(
    json
  );
  p.bet = bet;
  p.raise = raise;
  p.holeCards = holeCards;
  p.folded = folded;
  p.showCards = showCards;
  p.left = left;
  return p;
};
