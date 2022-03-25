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
const initialConstructorArgumentsDeserializationSpec: ArgumentsDeserializationSpec<
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
const deserializeInitialConstructorArgs = creatDeserializeArgumentsFn(
  initialConstructorArgumentsDeserializationSpec
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
 * Given a Table, return a function that will deserialize a JSON representation
 * of a Player.
 * @param t the deserialized Table the Players are sitting at
 * @returns a function that will deserialize a JSON representation of a Player;
 *   function take JSONValue and returns a Player
 */
export const createDeserializeFn = (t: Table): Deserialize<Player> => (
  json: JSONValue
) => {
  const p = new Player(...deserializeInitialConstructorArgs(json), t);
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

const firstConstructorArgumentDeserializationSpec = [
  initialConstructorArgumentsDeserializationSpec[0],
];
const deserializeFirstConstructorArgs = creatDeserializeArgumentsFn(
  firstConstructorArgumentDeserializationSpec
);
/**
 * Given a list of deserialized Players, return a function that will
 * deserialize a JSON representation of a reference to one of the
 * provided deserialized Players. Alternatively, returns a function
 * that will return one of the deserialied Players that matches
 * the JSON.
 * @param players a list of deserialized Players
 * @returns a function that will deserialize a JSON representation
 *   of a reference to one of the provided deserialized Players;
 *   function takes a JSONValue and returns one of the deserialized
 *   Players that matches the JSONValue
 */
export const createRefDeserializeFn = (
  players: (Player | null)[]
): Deserialize<Player> => (json: JSONValue) => {
  const [id] = deserializeFirstConstructorArgs(json);
  const player = players.find((player) => player?.id === id);
  if (!player) {
    throw new Error(`Cannot find reference to Player with id "${id}"`);
  }
  return player;
};
