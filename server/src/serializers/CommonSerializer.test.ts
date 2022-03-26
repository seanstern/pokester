import { serialize } from "./CommonSerializer";

describe("serialize", () => {
  describe("produced valid json", () => {
    describe("for base case JSONValue", () => {
      test("null", () => {
        expect(serialize(null)).toBeNull();
      });
      test("string", () => {
        expect(serialize("cat")).toBe("cat");
      });
      test("number", () => {
        expect(serialize(13)).toBe(13);
      });
      test("boolean", () => {
        expect(serialize(true)).toBe(true);
        expect(serialize(false)).toBe(false);
      });
    });

    describe("for valid recursive JSONValue", () => {
      describe("object", () => {
        test("with fields that are valid base case JSONValue", () => {
          expect(
            serialize({ a: null, b: "cat", c: 13, d: false })
          ).toStrictEqual({ a: null, b: "cat", c: 13, d: false });
        });
        test("with fields that are not valid base case JSONValue", () => {
          expect(
            serialize({ a: undefined, b: (n: number) => n + 1 })
          ).toStrictEqual({});
        });
        test("with fields that are objects", () => {
          expect(
            serialize({
              a: { b: { c: null }, d: "cat", e: { f: 13 }, g: false },
            })
          ).toStrictEqual({
            a: { b: { c: null }, d: "cat", e: { f: 13 }, g: false },
          });
        });
      });
      describe("array", () => {
        test("with elements that are valid base case JSONValue", () => {
          expect(serialize([null, "cat", 13, false])).toStrictEqual([
            null,
            "cat",
            13,
            false,
          ]);
        });
        test("with fields that are not valid base case JSONValue", () => {
          expect(
            serialize({ a: undefined, b: (n: number) => n + 1 })
          ).toStrictEqual({});
        });
        test("with fields that are recursive JSONValues", () => {
          expect(
            serialize({
              a: [null, "cat", 13, false],
              b: { a: [null, "cat", 13, false] },
            })
          ).toStrictEqual({
            a: [null, "cat", 13, false],
            b: { a: [null, "cat", 13, false] },
          });
        });
      });
    });
  });
});
