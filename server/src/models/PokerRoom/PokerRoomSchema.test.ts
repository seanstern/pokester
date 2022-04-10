import { model } from "mongoose";
import { asJestCasesTable } from "../../__fixtures__/TestCaseUtils";
import * as TableFixtures from "../../__fixtures__/poker-engine/Table.fixture";
import { serialize } from "../../serializers/TableSerializer";
import PokerRoomSchema from "./PokerRoomSchema";

const TestPokerRoomModel = model("Test Poker Room", PokerRoomSchema);

const tableCases = asJestCasesTable(TableFixtures);

describe("constructor properly sets document fields with", () => {
  test.each(tableCases)("$description", ({ create }) => {
    const constructorArg = {
      creatorId: "le chiffre",
      name: "casion royale",
      table: create(),
    };
    const {
      name,
      creatorId,
      serializedTable,
      playerIds,
    } = new TestPokerRoomModel(constructorArg);
    expect(name).toStrictEqual(constructorArg.name);
    expect(creatorId).toStrictEqual(constructorArg.creatorId);
    expect(serializedTable).toStrictEqual(serialize(constructorArg.table));
    expect(playerIds).toStrictEqual(
      constructorArg.table.players.filter((p) => p !== null).map((p) => p!.id)
    );
  });
});
