import {
  serialize,
  deserializeString,
  Unserializable,
  JSONValue,
  Deserialize,
  deserializeNumber,
  deserializeBoolean,
  createDeserializeArrayFn,
  ArgumentsDeserializationSpec,
  createDeserializeArgumentsFn,
  FieldDeserializationSpec,
  createDeserializeFieldsFn,
  createDeserializeOptionalFn,
  createDeserializeNullableFn,
  assignDeserializedFieldsTo,
} from "./CommonSerializer";

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
      expect(() => serialize((() => null) as any)).toThrow(/function/);
    });

    test("when given a symbol", () => {
      expect(() => serialize(Symbol("sym") as any)).toThrow(/symbol/);
    });

    test("when given a bigint", () => {
      expect(() => serialize(1n as any)).toThrow(/bigint/);
    });

    test("when given undefined", () => {
      expect(() => serialize(undefined as any)).toThrow(/undefined/);
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

type DeserializeBaseCaseJSONValueTableEntry<T> = {
  type: string;
  deserialize: Deserialize<T>;
};
const deserializeBaseCaseJSONValuesTable = [
  {
    type: "string",
    deserialize: deserializeString,
  } as DeserializeBaseCaseJSONValueTableEntry<string>,
  {
    type: "number",
    deserialize: deserializeNumber,
  } as DeserializeBaseCaseJSONValueTableEntry<number>,
  {
    type: "boolean",
    deserialize: deserializeBoolean,
  } as DeserializeBaseCaseJSONValueTableEntry<boolean>,
];

const nullJSONValuesTableElement = { type: "null", value: null as null };

const jsonValuesTable: { type: string; value: JSONValue }[] = [
  nullJSONValuesTableElement,
  { type: "string", value: "foo" as string },
  { type: "number", value: 13 as number },
  { type: "boolean", value: false as boolean },
  { type: "object", value: { a: "foo" } as { [key: string]: any } },
  { type: "array", value: [null, "foo", 13] as any[] },
];

const undefinedValuesTableEntry = {
  type: "undefined",
  value: undefined as undefined,
};

const unserializableValuesTable: { type: string; value: Unserializable }[] = [
  // eslint-disable-next-line @typescript-eslint/ban-types
  { type: "function", value: (() => 5) as Function },
  { type: "symbol", value: Symbol("sym") as symbol },
  { type: "bigint", value: 1n as bigint },
  undefinedValuesTableEntry,
];

describe("deseserialize*", () => {
  describe.each(deserializeBaseCaseJSONValuesTable)(
    "$type",
    ({ type: describeName, deserialize }) => {
      const deserializableJSONValuesTable = jsonValuesTable.filter(
        ({ type: testName }) => testName === describeName
      );
      const throwableJSONValuesTable = jsonValuesTable.filter(
        ({ type: testName }) => testName !== describeName
      );
      const throwableValuesTable = [
        ...throwableJSONValuesTable,
        ...unserializableValuesTable,
      ];

      test.each(deserializableJSONValuesTable)(
        "produces a $type when given a $type",
        ({ value }) => {
          expect(deserialize(value)).toStrictEqual(value);
        }
      );

      test.each(throwableValuesTable)(
        "throws when given a $type",
        ({ value }) => {
          expect(() => deserialize(value as any)).toThrow(
            new RegExp(describeName)
          );
        }
      );
    }
  );
});

describe("createDeserialize*ArrayFn", () => {
  const unserializableValueArraysTable: {
    type: string;
    value: Unserializable[];
  }[] = [
    { type: "function", value: [() => 5, (x: number) => x + 1] },
    { type: "symbol", value: [Symbol("sym"), Symbol("sym2")] },
    { type: "bigint", value: [1n, 2n] },
    { type: "undefined", value: [undefined, undefined] },
  ];

  const jsonValueArraysTable: { type: string; value: JSONValue[] }[] = [
    { type: "empty", value: [] },
    { type: "null", value: [null, null, null] },
    { type: "string", value: ["foo", "bar", "baz"] },
    { type: "number", value: [3, 1, 4, 1, 5, 9] },
    { type: "boolean", value: [false, true] },
    { type: "object", value: [{ a: "foo" }, { a: "bar" }] },
    { type: "mixed", value: [null, "foo", 13] },
  ];
  describe.each(deserializeBaseCaseJSONValuesTable)(
    "$type",
    ({ type: describeName, deserialize: deserializeElement }) => {
      const deserializableJSONValueArraysTable = jsonValueArraysTable.filter(
        ({ type: testName }) =>
          testName === describeName || testName === "empty"
      );
      const throwableJSONValueArraysTable = jsonValueArraysTable.filter(
        ({ type: testName }) =>
          testName !== describeName && testName !== "empty"
      );
      const throwableArraysTable = [
        ...unserializableValueArraysTable,
        ...throwableJSONValueArraysTable,
      ];

      const throwableValuesTable = jsonValuesTable.filter(
        ({ type }) => type !== "array"
      );

      const deserializeArray =
        createDeserializeArrayFn<ReturnType<typeof deserializeElement>>(
          deserializeElement
        );

      test.each(deserializableJSONValueArraysTable)(
        `created deserialize ${describeName}[] fn produces a ${describeName}[] when given $type[]`,
        ({ value }) => {
          expect(deserializeArray(value)).toStrictEqual(value);
        }
      );

      test.each(throwableArraysTable)(
        `created deserialize ${describeName}[] fn throws when given $type[]`,
        ({ value }) => {
          expect(() => deserializeArray(value as any)).toThrow(
            new RegExp(`${describeName}[^]*element [0-9]+ in array`)
          );
        }
      );

      test.each(throwableValuesTable)(
        `created deserialize ${describeName}[] fn throws when given $type`,
        ({ value }) => {
          expect(() => deserializeArray(value)).toThrow(/array/);
        }
      );
    }
  );
});

describe("createDeseraizlieArgumentsFn", () => {
  type DeserializedArgumentArray = [foo: boolean, bar: string, baz: number[]];
  const ads: ArgumentsDeserializationSpec<DeserializedArgumentArray> = [
    {
      serializedKeyName: "foo",
      deserialize: deserializeBoolean,
    },
    {
      serializedKeyName: "bar",
      deserialize: deserializeString,
    },
    {
      serializedKeyName: "baz",
      deserialize: createDeserializeArrayFn(deserializeNumber),
    },
  ];
  const deserializeArguments = createDeserializeArgumentsFn(ads);

  describe("created deserializeArguments fn produces valid deserialized array when given", () => {
    test("serialized object with only valid serializedKeyNames", () => {
      expect(
        deserializeArguments({
          baz: [3, 1, 4, 1, 5, 9],
          foo: false,
          bar: "the quick brown fox",
        })
      ).toStrictEqual([false, "the quick brown fox", [3, 1, 4, 1, 5, 9]]);
    });

    test("serialized object with additional serializedKeyNames", () => {
      expect(
        deserializeArguments({
          baz: [3, 1, 4, 1, 5, 9],
          foo: false,
          bar: "the quick brown fox",
          additional: "not really used",
        })
      ).toStrictEqual([false, "the quick brown fox", [3, 1, 4, 1, 5, 9]]);
    });
  });

  describe("created deserializeArguments fn throws when given", () => {
    test.each([
      ["null", null],
      ["string", "foo"],
      ["number", 5],
      ["boolean", true],
      ["array", [true, "foo", [-35, 0]] as DeserializedArgumentArray],
    ])("%s", (_, val) => {
      expect(() => deserializeArguments(val)).toThrow(/object/);
    });

    test("object with missing serializedKeyName", () => {
      expect(() => {
        deserializeArguments({
          foo: true,
          bar: "jumped over the lazy dog",
        });
      }).toThrow(/array[^]*baz/);
    });

    test("object with serializedKeyName of wrong type", () => {
      expect(() => {
        deserializeArguments({
          foo: true,
          bar: "jumped over the lazy dog",
          baz: ["3", "1", "4"],
        });
      }).toThrow(/number[^]*element [0-9]+ in array[^]*baz/);
    });
  });
});

describe("createDeserializeFieldsFn", () => {
  type DeserializedObject = {
    foo: boolean;
    bar: string;
    baz: number[];
  };
  const fds: FieldDeserializationSpec<
    DeserializedObject,
    "foo" | "bar" | "baz"
  > = {
    foo: deserializeBoolean,
    bar: deserializeString,
    baz: createDeserializeArrayFn(deserializeNumber),
  };

  const deserializeFields = createDeserializeFieldsFn(fds);

  describe("created deserializeFields fn produces valid deserialized object when given", () => {
    test("serialized object with only valid fields", () => {
      expect(
        deserializeFields({
          baz: [3, 1, 4, 1, 5, 9],
          foo: false,
          bar: "the quick brown fox",
        })
      ).toStrictEqual({
        foo: false,
        bar: "the quick brown fox",
        baz: [3, 1, 4, 1, 5, 9],
      });
    });

    test("serialized object with additional serializedKeyNames", () => {
      expect(
        deserializeFields({
          baz: [3, 1, 4, 1, 5, 9],
          foo: false,
          bar: "the quick brown fox",
          additional: "not really used",
        })
      ).toStrictEqual({
        foo: false,
        bar: "the quick brown fox",
        baz: [3, 1, 4, 1, 5, 9],
      });
    });
  });

  describe("created deserializeFields fn throws when given", () => {
    test.each([
      ["null", null],
      ["string", "foo"],
      ["number", 5],
      ["boolean", true],
      ["array", [true, "foo", [-35, 0]]],
    ])("%s", (_, val) => {
      expect(() => deserializeFields(val)).toThrow(/object/);
    });

    test("object with missing fields", () => {
      expect(() => {
        deserializeFields({
          foo: true,
          bar: "jumped over the lazy dog",
        });
      }).toThrow(/array[^]*baz/);
    });

    test("object with serializedKeyName of wrong type", () => {
      expect(() => {
        deserializeFields({
          foo: true,
          bar: "jumped over the lazy dog",
          baz: ["3", "1", "4"],
        });
      }).toThrow(/number[^]*element [0-9]+ in array[^]*baz/);
    });
  });
});

describe("assignDeserializedFieldsTo", () => {
  test("assigns fields to mutable deserialized object", () => {
    class TestClass {
      public strToReplace = "replace me";
      public strToLeave = "leave me";
      public optStrToReplace?: string;
      public optStrToLeave?: string;
      public boolToReplace = true;
      public boolToLeave = false;
      public optBoolToReplace?: boolean;
      public optBoolToLeave?: boolean;
    }

    const testObj = new TestClass();
    const mutatedTestObj = assignDeserializedFieldsTo(testObj, {
      strToReplace: "replaced",
      optStrToReplace: "also replaced",
      boolToReplace: false,
      optBoolToReplace: true,
    });
    expect(mutatedTestObj).toBe(testObj);

    const expectedMutatedTestObj = new TestClass();
    expectedMutatedTestObj.strToReplace = "replaced";
    expectedMutatedTestObj.optStrToReplace = "also replaced";
    expectedMutatedTestObj.boolToReplace = false;
    expectedMutatedTestObj.optBoolToReplace = true;
    expect(mutatedTestObj).toStrictEqual(expectedMutatedTestObj);
  });
});

describe("createDeserializeOptional*Fn", () => {
  describe.each(deserializeBaseCaseJSONValuesTable)(
    "$type",
    ({ type: describeName, deserialize }) => {
      const deserializableValuesTable = [
        ...jsonValuesTable.filter(
          ({ type: testName }) => testName === describeName
        ),
        undefinedValuesTableEntry,
      ];

      const throwableJSONValuesTable = jsonValuesTable.filter(
        ({ type: testName }) => testName !== describeName
      );
      const unserializableValuesTableSansUndefined =
        unserializableValuesTable.filter(
          ({ type: testName }) => testName !== undefinedValuesTableEntry.type
        );
      const throwableValuesTable = [
        ...throwableJSONValuesTable,
        ...unserializableValuesTableSansUndefined,
      ];

      const deserializeOptional =
        createDeserializeOptionalFn<ReturnType<typeof deserialize>>(
          deserialize
        );

      test.each(deserializableValuesTable)(
        `created deserializeOptional ${describeName} produces a $type when given a $type`,
        ({ value }) => {
          expect(deserializeOptional(value)).toStrictEqual(value);
        }
      );

      test.each(throwableValuesTable)(
        `created deserializeOptional ${describeName} throws when given a $type`,
        ({ value }) => {
          expect(() => deserializeOptional(value as any)).toThrow(
            new RegExp(describeName)
          );
        }
      );
    }
  );
});

describe("createDeserializeNullable*Fn", () => {
  describe.each(deserializeBaseCaseJSONValuesTable)(
    "$type",
    ({ type: describeName, deserialize }) => {
      const deserializableValuesTable = jsonValuesTable.filter(
        ({ type: testName }) =>
          [describeName, nullJSONValuesTableElement.type].includes(testName)
      );

      const throwableJSONValuesTable = jsonValuesTable.filter(
        ({ type: testName }) =>
          ![describeName, nullJSONValuesTableElement.type].includes(testName)
      );
      const throwableValuesTable = [
        ...throwableJSONValuesTable,
        ...unserializableValuesTable,
      ];

      const deserializNullable =
        createDeserializeNullableFn<ReturnType<typeof deserialize>>(
          deserialize
        );

      test.each(deserializableValuesTable)(
        `created deserializeNullable ${describeName} produces a $type when given a $type`,
        ({ value }) => {
          expect(deserializNullable(value)).toStrictEqual(value);
        }
      );

      test.each(throwableValuesTable)(
        `created deserializeNullable ${describeName} throws when given a $type`,
        ({ value }) => {
          expect(() => deserializNullable(value as any)).toThrow(
            new RegExp(describeName)
          );
        }
      );
    }
  );
});
