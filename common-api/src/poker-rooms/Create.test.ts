import {
  reqBodySchema,
  ReqBody,
  nameLabel,
  smallBlindLabel,
  bigBlindLabel,
  buyInLabel,
} from "./Create";

const validReqBodyTable: [
  string,
  Partial<Record<keyof ReqBody, any>>,
  ReqBody
][] = [
  [
    "shortest name",
    { name: "a12", smallBlind: 1, bigBlind: 2, buyIn: 4 },
    { name: "a12", smallBlind: 1, bigBlind: 2, buyIn: 4 },
  ],
  [
    "name with min alphanumeric characters",
    { name: "a 1 2", smallBlind: 1, bigBlind: 2, buyIn: 4 },
    { name: "a 1 2", smallBlind: 1, bigBlind: 2, buyIn: 4 },
  ],
  [
    "longest name",
    {
      name: "abcdefghij klmnopqrstuvwxy z0123456789  ",
      smallBlind: 1,
      bigBlind: 2,
      buyIn: 4,
    },
    {
      name: "abcdefghij klmnopqrstuvwxy z0123456789  ",
      smallBlind: 1,
      bigBlind: 2,
      buyIn: 4,
    },
  ],
  [
    "smallBlind just greater than 0",
    { name: "a12cdf", smallBlind: 0.01, bigBlind: 1, buyIn: 4 },
    { name: "a12cdf", smallBlind: 0.01, bigBlind: 1, buyIn: 4 },
  ],
  [
    "bigBlind just greater than smallBlind",
    { name: "a12cdf", smallBlind: 1, bigBlind: 1.01, buyIn: 4 },
    { name: "a12cdf", smallBlind: 1, bigBlind: 1.01, buyIn: 4 },
  ],
  [
    "buyIn just greater than bigBlind",
    { name: "a12cdf", smallBlind: 1, bigBlind: 2, buyIn: 2.01 },
    { name: "a12cdf", smallBlind: 1, bigBlind: 2, buyIn: 2.01 },
  ],
  [
    "smallBlind undefined",
    { name: "a12cdf", bigBlind: 2, buyIn: 4 },
    { name: "a12cdf", smallBlind: 0.5, bigBlind: 2, buyIn: 4 },
  ],
  [
    "bigBlind undefined",
    { name: "a12cdf", smallBlind: 1, buyIn: 4 },
    { name: "a12cdf", smallBlind: 1, bigBlind: 2, buyIn: 4 },
  ],
  [
    "buyIn undefined",
    { name: "a12cdf", smallBlind: 2, bigBlind: 4 },
    { name: "a12cdf", smallBlind: 2, bigBlind: 4, buyIn: 80 },
  ],
  [
    "smallBlind, bigBlind, buyIn undefined",
    { name: "a12ccf" },
    { name: "a12ccf", smallBlind: 0.5, bigBlind: 1, buyIn: 20 },
  ],
  [
    "smallBlind as string",
    { name: "a12ccf", smallBlind: "1.1", bigBlind: 2, buyIn: 4 },
    { name: "a12ccf", smallBlind: 1.1, bigBlind: 2, buyIn: 4 },
  ],
  [
    "bigBlind as string",
    { name: "a12ccf", smallBlind: 1, bigBlind: "2.2", buyIn: 4 },
    { name: "a12ccf", smallBlind: 1, bigBlind: 2.2, buyIn: 4 },
  ],
  [
    "buyIn as string",
    { name: "a12ccf", smallBlind: 1, bigBlind: 2, buyIn: "4.4" },
    { name: "a12ccf", smallBlind: 1, bigBlind: 2, buyIn: 4.4 },
  ],
];

const invalidReqBodyTable: [
  string,
  Partial<Record<keyof ReqBody, any>>,
  string
][] = [
  [
    "name too short",
    { name: "a1", smallBlind: 1, bigBlind: 2, buyIn: 4 },
    nameLabel,
  ],
  [
    "name with too few alphanumeric chars",
    { name: "a   2", smallBlind: 1, bigBlind: 2, buyIn: 4 },
    nameLabel,
  ],
  [
    "name too long name",
    {
      name: "abcdefghij klmnopqrstuvwxy z0123456789   ",
      smallBlind: 1,
      bigBlind: 2,
      buyIn: 4,
    },
    nameLabel,
  ],
  [
    "smallBlind 0",
    { name: "a12cdf", smallBlind: 0, bigBlind: 1, buyIn: 4 },
    smallBlindLabel,
  ],
  [
    "bigBlind equal to smallBlind",
    { name: "a12cdf", smallBlind: 1, bigBlind: 1, buyIn: 4 },
    bigBlindLabel,
  ],
  [
    "buyIn equal to bigBlind",
    { name: "a12cdf", smallBlind: 1, bigBlind: 2, buyIn: 2 },
    buyInLabel,
  ],
  ["name undefined", { smallBlind: 1, bigBlind: 2, buyIn: 4 }, nameLabel],
  [
    "smallBlind NaN",
    { name: "a12cdf", smallBlind: NaN, bigBlind: 2, buyIn: 4 },
    smallBlindLabel,
  ],
  [
    "bigBlind NaN",
    { name: "a12cdf", smallBlind: 1, bigBlind: NaN, buyIn: 4 },
    bigBlindLabel,
  ],
  [
    "buyIn NaN",
    { name: "a12cdf", smallBlind: 1, bigBlind: 2, buyIn: NaN },
    buyInLabel,
  ],
];

describe("reqBodySchema", () => {
  describe("isValidSync", () => {
    test.each(validReqBodyTable)(
      "returns true when given valid req body with %s",
      (_, validReqBody) => {
        expect(reqBodySchema.isValidSync(validReqBody)).toBe(true);
      }
    );

    test.each(invalidReqBodyTable)(
      "returns false when given invalid req body with %s",
      (_, invalidReqBody) => {
        expect(reqBodySchema.isValidSync(invalidReqBody)).toBe(false);
      }
    );
  });

  describe("validateSync", () => {
    test.each(validReqBodyTable)(
      "casts to expected object when given valid req body with %s",
      (_, validReqBody, castReqBody) => {
        expect(reqBodySchema.validateSync(validReqBody)).toStrictEqual(
          castReqBody
        );
      }
    );

    test.each(invalidReqBodyTable)(
      "throws when given invalid req body with %s",
      (_, invalidReqBody, invalidFieldLabel) => {
        expect(() => reqBodySchema.validateSync(invalidReqBody)).toThrowError(
          new RegExp(invalidFieldLabel)
        );
      }
    );
  });
});
