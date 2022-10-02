import reqBodySchema, { usernameLabel } from "./ReqBodySchema";
import { ReqBody } from "./Types";

const validReqBodyTable: [
  string,
  Partial<Record<keyof ReqBody, any>>,
  ReqBody
][] = [
  ["shortest username", { username: "foo" }, { username: "foo" }],
  [
    "longest username",
    { username: "abcdefghijklmnopqrstuvwxyz0123456789ABCD" },
    { username: "abcdefghijklmnopqrstuvwxyz0123456789ABCD" },
  ],
  ["no username", {}, {}],
];

const invalidReqBodyTable: [
  string,
  Partial<Record<keyof ReqBody, any>>,
  string
][] = [
  ["username too short", { username: "fo" }, usernameLabel],
  [
    "username too long",
    { username: "abcdefghijklmnopqrstuvwxyz0123456789ABCDE" },
    usernameLabel,
  ],
  [
    "username with non-alphanueric chars",
    { username: "foo.bar" },
    usernameLabel,
  ],
  ["null username", { username: null }, usernameLabel],
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
