import { serialize } from "./CommonSerializer";

describe("serialize", () => {
  describe("produces valid json", () => {
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

    describe("for valid recursively defined JSONValue", () => {
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
        test("with keys to omit", () => {
          expect(
            serialize(
              {
                a: { b: { c: null }, c: 13, d: "cat", e: { f: 13 }, g: false },
              },
              "c",
              "e",
              "g"
            )
          ).toStrictEqual({
            a: { b: {}, d: "cat" },
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
          expect(serialize([(n: number) => n + 1, undefined])).toStrictEqual([
            null,
            null,
          ]);
        });
        test("with fields that are arrays", () => {
          expect(
            serialize([
              [null, "cat", 13, false],
              [null, "cat", 13, false],
            ])
          ).toStrictEqual([
            [null, "cat", 13, false],
            [null, "cat", 13, false],
          ]);
        });
      });

      describe("mixed", () => {
        expect(
          serialize({
            a: "cat",
            b: 13,
            c: true,
            d: null,
            e: undefined,
            f: Symbol("sym0"),
            g: (n: number) => n + 1,
            h: [
              "dog",
              -12,
              false,
              null,
              undefined,
              Symbol("sym1"),
              (n: number) => n + 1,
              {},
            ],
            i: {
              a: "fish",
              b: 3.14,
              c: false,
              d: null,
              e: undefined,
              f: Symbol("sym2"),
              g: (b: boolean) => !b,
              h: [
                "dog",
                -12,
                false,
                null,
                undefined,
                Symbol("sym1"),
                (n: number) => n + 1,
                {},
              ],
            },
          })
        ).toStrictEqual({
          a: "cat",
          b: 13,
          c: true,
          d: null,
          h: ["dog", -12, false, null, null, null, null, {}],
          i: {
            a: "fish",
            b: 3.14,
            c: false,
            d: null,
            h: ["dog", -12, false, null, null, null, null, {}],
          },
        });
      });
    });
  });

  describe("throws", () => {
    test("when given function", () => {
      expect(() => serialize((() => null) as any)).toThrow();
    });

    test("when given a symbol", () => {
      expect(() => serialize(Symbol("sym") as any)).toThrow();
    });

    test("when given a bigint", () => {
      expect(() => serialize(1n as any)).toThrow();
    });

    test("when given undefined", () => {
      expect(() => serialize(undefined as any)).toThrow();
    });
  });

  describe("with omitted key(s)", () => {
    describe("produces valid json", () => {
      test("when unserializable field keys omitted", () => {
        const objWithBigIntField = {
          a: "foo",
          b: true,
          c: 33,
          bigIntField: 1n,
        };
        expect(serialize(objWithBigIntField, "bigIntField")).toStrictEqual({
          a: "foo",
          b: true,
          c: 33,
        });
      });

      test("when circular field key(s) omitted", () => {
        type CircularObj = {
          a: string;
          b: boolean;
          c: number;
          circularKey?: CircularObj;
        };
        const circularObj: CircularObj = {
          a: "foo",
          b: true,
          c: 33,
        };
        circularObj.circularKey = circularObj;
        expect(serialize(circularObj, "circularKey")).toStrictEqual({
          a: "foo",
          b: true,
          c: 33,
        });
      });

      test("when multi-level field key(s) omitted", () => {
        expect(
          serialize(
            {
              a: "foo",
              b: true,
              toOmit: 33,
              arrayWithToOmit: [
                { a: "bar0", b: false, toOmit: { a: "baz0", b: true } },
                { a: "bar1", b: false, toOmit: { a: "baz1", b: true } },
              ],
              objWithToOmit: {
                a: "baz",
                b: true,
                toOmit: {
                  a: "foo",
                  toOmit: "omit",
                },
              },
            },
            "toOmit"
          )
        ).toStrictEqual({
          a: "foo",
          b: true,
          arrayWithToOmit: [
            { a: "bar0", b: false },
            { a: "bar1", b: false },
          ],
          objWithToOmit: {
            a: "baz",
            b: true,
          },
        });
      });
    });
  });
});
