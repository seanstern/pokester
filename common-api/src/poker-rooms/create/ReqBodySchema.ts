import { number, object, SchemaOf, string } from "yup";
import { ReqBody } from "./Types";

const userFriendlyNumberTypeError = "${path} must be a number";

export const smallBlindLabel = "small blind";
export const bigBlindLabel = "big blind";
export const buyInLabel = "buy in";
export const nameLabel = "name";

export const defaultSmallBlind = 0.5;
export const defaultBigBlindToSmallBlindRatio = 2;
export const defaultBuyInToBigBlindRatio = 20;

export const schema: SchemaOf<ReqBody> = object({
  name: string()
    .label(nameLabel)
    .required()
    .min(3)
    .max(40)
    .matches(
      /^[A-Za-z0-9 ]*$/,
      "${path} must contain only alphanumeric chars and spaces"
    )
    .matches(
      /(.*[A-Za-z0-9]){3}/,
      "${path} must contain at least 3 alphanumeric chars"
    ),
  smallBlind: number()
    .typeError(userFriendlyNumberTypeError)
    .label(smallBlindLabel)
    .required()
    .positive()
    .default(defaultSmallBlind),
  bigBlind: number()
    .label(bigBlindLabel)
    .typeError(userFriendlyNumberTypeError)
    .required()
    .positive()
    .when(
      "smallBlind",
      (smallBlind: number, schema: ReturnType<typeof number>) =>
        schema
          .moreThan(
            smallBlind,
            `\${path} must be greater than ${smallBlindLabel}`
          )
          .default(smallBlind * defaultBigBlindToSmallBlindRatio)
    ),
  buyIn: number()
    .label(buyInLabel)
    .typeError(userFriendlyNumberTypeError)
    .required()
    .positive()
    .when("bigBlind", (bigBlind: number, schema: ReturnType<typeof number>) =>
      schema
        .moreThan(bigBlind, `\${path} must be greater than ${bigBlindLabel}`)
        .default(bigBlind * defaultBuyInToBigBlindRatio)
    ),
});
