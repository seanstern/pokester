import { model } from "mongoose";
import { serialize } from "../../serializers/TableSerializer";
import * as TableFixtures from "../../__fixtures__/poker-engine/Table.fixture";
import { asJestCasesTable } from "../../__fixtures__/TestCaseUtils";
// import * in order to jest.spyOn below
import * as PokerRoomSchemaModule from "./PokerRoomSchema";

const TestPokerRoomModel = model<
  PokerRoomSchemaModule.SerializedPokerRoomDoc,
  PokerRoomSchemaModule.SerializedPokerRoomModel
>("Test Poker Room", PokerRoomSchemaModule.default);

const tableCases = asJestCasesTable(TableFixtures);

describe("getPlayerIds returns playerIds when given", () => {
  test.each(tableCases)("$description", ({ create }) => {
    const table = create();
    expect(PokerRoomSchemaModule.getPlayerIds(table)).toStrictEqual(
      table.players.filter((p) => p !== null).map((p) => p!.id)
    );
  });
});

describe("virtuals", () => {
  describe("virtualTableSetter sets this.playerIds, this.serializedTable, this.deserializedTable when given", () => {
    test.each(tableCases)("$description", ({ create }) => {
      const table = create();
      const obj: ThisParameterType<
        typeof PokerRoomSchemaModule.virtualTableSetter
      > = {};
      PokerRoomSchemaModule.virtualTableSetter.call(obj, table);

      const { deserializedTable, ...rest } = obj;

      expect({ ...rest }).toStrictEqual({
        playerIds: PokerRoomSchemaModule.getPlayerIds(table),
        serializedTable: serialize(table),
      });
      expect(deserializedTable).toBe(table);
    });
  });

  test("virtualTableGetter returns this.deserializedTable", () => {
    const table = TableFixtures.emptyTable.create();
    const obj = { deserializedTable: table };
    expect(PokerRoomSchemaModule.virtualTableGetter.call(obj)).toBe(table);
  });
});

describe("middleware", () => {
  test("postInitDeserializeTable calls virtualTableSetter", () => {
    const virtualTableSetterSpy = jest.spyOn(
      PokerRoomSchemaModule,
      "virtualTableSetter"
    );
    const table = TableFixtures.emptyTable.create();
    const obj: ThisParameterType<
      typeof PokerRoomSchemaModule.postInitDeserializeTable
    > = { serializedTable: serialize(table) };

    PokerRoomSchemaModule.postInitDeserializeTable.call(obj);

    expect(virtualTableSetterSpy).toHaveBeenCalledTimes(1);
    expect(virtualTableSetterSpy).toHaveBeenCalledWith(table);
  });

  test("preValidateSerializeTable calls virtualTableSetter", () => {
    const virtualTableSetterSpy = jest.spyOn(
      PokerRoomSchemaModule,
      "virtualTableSetter"
    );
    const table = TableFixtures.emptyTable.create();
    const obj: ThisParameterType<
      typeof PokerRoomSchemaModule.preValidateSerializeTable
    > = { deserializedTable: table };

    PokerRoomSchemaModule.preValidateSerializeTable.call(obj);

    expect(virtualTableSetterSpy).toHaveBeenCalledTimes(1);
    expect(virtualTableSetterSpy).toHaveBeenCalledWith(table);
  });
});

describe("constructor properly sets document fields when given", () => {
  test.each(tableCases)("$description", ({ create }) => {
    const constructorArg = {
      creatorId: "le chiffre",
      name: "casion royale",
      table: create(),
    };
    const {
      name,
      creatorId,
      table,
      serializedTable,
      playerIds,
    } = new TestPokerRoomModel(constructorArg);
    expect(name).toStrictEqual(constructorArg.name);
    expect(creatorId).toStrictEqual(constructorArg.creatorId);
    expect(table).toStrictEqual(table);
    expect(serializedTable).toStrictEqual(serialize(constructorArg.table));
    expect(playerIds).toStrictEqual(
      PokerRoomSchemaModule.getPlayerIds(constructorArg.table)
    );
  });
});
