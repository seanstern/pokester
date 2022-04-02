import { Card, CardRank, CardSuit } from "@chevtek/poker-engine";
import {
  ArgumentsDeserializationSpec,
  createDeserializeArgumentsFn,
  Deserialize,
  JSONValue,
  serialize as serializeCommon,
} from "./CommonSerializer";

/**
 * Given an Card, returns a JSON conformant version of the Card
 * @param c a Card
 * @returns a JSON conformant version of the Card
 */
export const serialize: (c: Card) => JSONValue = serializeCommon;

/**
 * Given a JSONValue, returns true when it represent a CardRank
 * and false otherwise
 * @param json a JSONValue
 * @returns true when json is a CardRank, false otherwise
 */
const isCardRank = (json: JSONValue): json is CardRank =>
  typeof json === "string" && Object.values<string>(CardRank).includes(json);

/**
 * Given a JSONValue, returns true when it represent a CardSuit
 * and false otherwise
 * @param json a JSONValue
 * @returns true when json is a CardSuit, false otherwise
 */
const isCardSuit = (json: JSONValue): json is CardSuit =>
  typeof json === "string" && Object.values<string>(CardSuit).includes(json);

const constructorArgumentsDeserializationSpec: ArgumentsDeserializationSpec<
  ConstructorParameters<typeof Card>
> = [
  {
    serializedKeyName: "_rank",
    deserialize: (jsonValue) => {
      if (!isCardRank(jsonValue)) {
        throw new Error("Cannot deserialize JSON that is not CardRank");
      }
      return jsonValue;
    },
  },
  {
    serializedKeyName: "_suit",
    deserialize: (jsonValue) => {
      if (!isCardSuit(jsonValue)) {
        throw new Error("Cannot deserialize JSON that is not CardSuit");
      }
      return jsonValue;
    },
  },
];
const deserializeConstructorArgs = createDeserializeArgumentsFn(
  constructorArgumentsDeserializationSpec
);

/**
 * Given a JSON represenation of a Card, returns a Card.
 * @param json a JSON representation of a Card
 * @returns a Card
 */
export const deserialize: Deserialize<Card> = (json: JSONValue) =>
  new Card(...deserializeConstructorArgs(json));
