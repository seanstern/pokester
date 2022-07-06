import { Player, Card, Table } from "@chevtek/poker-engine";
import {
  ArgumentsDeserializationSpec,
  createDeserializeArgumentsFn,
  Deserialize,
  deserializeString,
  deserializeNumber,
  JSONValue,
  createDeserializeArrayFn,
  deserializeBoolean,
  createDeserializeFieldsFn,
  createDeserializeOptionalFn,
  serialize as serializeCommon,
  assignDeserializedFieldsTo,
} from "./CommonSerializer";
import { deserialize as deseralizeCard } from "./CardSerializer";

/**
 * Given a Player, returns a JSON conformant version of the Player
 *
 * @param p a Player
 * @returns a JSON conformant version of the Player
 */
export const serialize = (p: Player) => serializeCommon(p, "table");

type OmitLast<T> = T extends [...infer S, any] ? S : never;
const deserializeInitialConstructorArgs = createDeserializeArgumentsFn([
  {
    serializedKeyName: "id",
    deserialize: deserializeString,
  },
  {
    serializedKeyName: "stackSize",
    deserialize: deserializeNumber,
  },
] as ArgumentsDeserializationSpec<OmitLast<ConstructorParameters<typeof Player>>>);

const deserializeCardArray = createDeserializeArrayFn(deseralizeCard);

const deserializeFields = createDeserializeFieldsFn<
  Player,
  "bet" | "raise" | "holeCards" | "folded" | "showCards" | "left"
>({
  bet: deserializeNumber,
  raise: createDeserializeOptionalFn(deserializeNumber),
  holeCards: createDeserializeOptionalFn((json: JSONValue) => {
    const cardArray = deserializeCardArray(json);
    if (cardArray.length !== 2) {
      throw new Error("Cannot serialize JSON that is not tuple of length 2");
    }
    return cardArray as [Card, Card];
  }),
  folded: deserializeBoolean,
  showCards: deserializeBoolean,
  left: deserializeBoolean,
});

export type MutableContext = {
  get(id: string): Player | undefined;
  set(id: string, p: Player): void;
};
/**
 * Given a Table, return a function that will deserialize a JSON representation
 * of a Player.
 *
 * @param t the deserialized Table the Players are sitting at
 * @returns a function that will deserialize a JSON representation of a Player;
 *   function take JSONValue and an optional mutableContext and returns a
 *   Player
 */
export const createDeserializeFn =
  (t: Table): Deserialize<Player, MutableContext> =>
  (json: JSONValue, mutableContext?: MutableContext) => {
    const constructorArgs = deserializeInitialConstructorArgs(json);
    if (mutableContext) {
      const [id] = constructorArgs;
      const playerFromContext = mutableContext.get(id);
      if (playerFromContext) {
        return playerFromContext;
      }
    }

    const player = assignDeserializedFieldsTo(
      new Player(...deserializeInitialConstructorArgs(json), t),
      deserializeFields(json)
    );

    if (mutableContext) {
      mutableContext.set(player.id, player);
    }

    return player;
  };
