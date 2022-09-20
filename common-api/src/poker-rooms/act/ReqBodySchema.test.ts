import reqBodySchema from "./ReqBodySchema";
import { PlayerAction, ReqBody } from "./Types";

const validReqBodyTable: [string, ReqBody, ReqBody][] = [
  [
    "bet",
    { action: PlayerAction.BET, amount: 0.01 },
    { action: PlayerAction.BET, amount: 0.01 },
  ],
  ["call", { action: PlayerAction.CALL }, { action: PlayerAction.CALL }],
  ["check", { action: PlayerAction.CHECK }, { action: PlayerAction.CHECK }],
  ["deal", { action: PlayerAction.DEAL }, { action: PlayerAction.DEAL }],
  ["fold", { action: PlayerAction.FOLD }, { action: PlayerAction.FOLD }],
  [
    "fold",
    { action: PlayerAction.RAISE, amount: 0.02 },
    { action: PlayerAction.RAISE, amount: 0.02 },
  ],
  ["sit", { action: PlayerAction.SIT }, { action: PlayerAction.SIT }],
  ["stand", { action: PlayerAction.STAND }, { action: PlayerAction.STAND }],
];

const invalidReqBodyTable: [string, any, string][] = [
  ["action invalid", { action: "NOT_AN_ACTION" }, "action"],
  ["action undefind", {}, "action"],
  [
    "bet with amount of wrong type",
    { action: PlayerAction.BET, amount: "cat" },
    "amount",
  ],
  ["bet with zero amount", { action: PlayerAction.BET, amount: 0 }, "amount"],
  [
    "bet with negative amount",
    { action: PlayerAction.BET, amount: -0.01 },
    "amount",
  ],
  ["bet with amount undefined", { action: PlayerAction.BET }, "amount"],
  [
    "raise with amount of wrong type",
    { action: PlayerAction.RAISE, amount: "cat" },
    "amount",
  ],
  [
    "raise with zero amount",
    { action: PlayerAction.RAISE, amount: 0 },
    "amount",
  ],
  [
    "raise with negative amount",
    { action: PlayerAction.RAISE, amount: -0.01 },
    "amount",
  ],
  ["raise with amount undefined", { action: PlayerAction.RAISE }, "amount"],
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
