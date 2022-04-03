import { Table, BettingRound } from "@chevtek/poker-engine";
import * as TableFixtures from "../__fixtures__/poker-engine/Table.fixture";
import { asJestCasesTable } from "../__fixtures__/TestCaseUtils";
import { deserialize, serialize } from "./TableSerializer";

const tableCases = asJestCasesTable(TableFixtures);

describe("serialize produces JSON when given Table", () => {
  test.each(tableCases)("$description", ({ create }) => {
    const t = create();
    expect(serialize(t)).toMatchSnapshot();
  });
});

describe("deserialize", () => {
  describe("produces Table when given serialized version of Table", () => {
    test.each(tableCases)("$description", ({ create }) => {
      const t = create();
      const deserializedT = deserialize(serialize(t));
      expect(deserializedT).not.toBe(t);
      expect(deserializedT).toStrictEqual(t);
    });
  });

  test("throws when given Table with invalid current round", () => {
    const serializedTable = serialize(new Table());
    (serializedTable as any).currentRound = "not a betting round";

    expect(() => deserialize(serializedTable)).toThrow(
      /BettingRound[^]*currentRound/
    );
  });
});
