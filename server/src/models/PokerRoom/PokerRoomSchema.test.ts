import { Player } from "@chevtek/poker-engine";
import {
  asJestCasesTable,
  Table as TableFixtures,
} from "@pokester/poker-engine-fixtures";
import { model } from "mongoose";
import { serialize } from "../../serializers/TableSerializer";
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
      (table.players.filter((p) => p !== null) as Player[]).map((p) => p.id)
    );
  });
});

describe("methods", () => {
  const fewerThanMaxPlayerIds: string[] = [];
  for (let i = 0; i < PokerRoomSchemaModule.MAX_PLAYER_IDS_LENGTH - 1; i++) {
    fewerThanMaxPlayerIds.push(i.toString());
  }
  const maxPlayerIds = [
    ...fewerThanMaxPlayerIds,
    (PokerRoomSchemaModule.MAX_PLAYER_IDS_LENGTH - 1).toString(),
  ];

  describe("canSit", () => {
    describe("succeeds", () => {
      test("and returns true", () => {
        const obj: ThisParameterType<typeof PokerRoomSchemaModule.canSit> = {
          playerIds: fewerThanMaxPlayerIds,
        };
        expect(
          PokerRoomSchemaModule.canSit.call(
            obj,
            PokerRoomSchemaModule.MAX_PLAYER_IDS_LENGTH.toString()
          )
        ).toBe(true);
      });

      describe("and returns false", () => {
        test("because playerId in playerIds", () => {
          const obj: ThisParameterType<typeof PokerRoomSchemaModule.canSit> = {
            playerIds: fewerThanMaxPlayerIds,
          };
          expect(
            PokerRoomSchemaModule.canSit.call(obj, fewerThanMaxPlayerIds[0])
          ).toBe(false);
        });

        test("because playerIds at max", () => {
          const obj: ThisParameterType<typeof PokerRoomSchemaModule.canSit> = {
            playerIds: maxPlayerIds,
          };
          expect(
            PokerRoomSchemaModule.canSit.call(
              obj,
              PokerRoomSchemaModule.MAX_PLAYER_IDS_LENGTH.toString()
            )
          ).toBe(false);
        });
      });
    });

    test("throws when playerIds not defined", () => {
      const obj: ThisParameterType<typeof PokerRoomSchemaModule.canSit> = {
        playerIds: undefined,
      };
      expect(() =>
        PokerRoomSchemaModule.canSit.call(
          obj,
          PokerRoomSchemaModule.MAX_PLAYER_IDS_LENGTH.toString()
        )
      ).toThrow();
    });
  });

  describe("isSeated", () => {
    describe("succeeds", () => {
      test("and returns true", () => {
        const obj: ThisParameterType<typeof PokerRoomSchemaModule.canSit> = {
          playerIds: maxPlayerIds,
        };
        expect(PokerRoomSchemaModule.isSeated.call(obj, maxPlayerIds[0])).toBe(
          true
        );
      });

      test("and returns false", () => {
        const obj: ThisParameterType<typeof PokerRoomSchemaModule.canSit> = {
          playerIds: fewerThanMaxPlayerIds,
        };
        expect(
          PokerRoomSchemaModule.isSeated.call(
            obj,
            PokerRoomSchemaModule.MAX_PLAYER_IDS_LENGTH.toString()
          )
        ).toBe(false);
      });
    });

    test("throws when playerIds not defined", () => {
      const obj: ThisParameterType<typeof PokerRoomSchemaModule.canSit> = {
        playerIds: undefined,
      };
      expect(() =>
        PokerRoomSchemaModule.isSeated.call(
          obj,
          PokerRoomSchemaModule.MAX_PLAYER_IDS_LENGTH.toString()
        )
      ).toThrow();
    });
  });
});

describe("query helpers", () => {
  describe("byCanPlayerSit suceeds", () => {
    test("when canSit is true", () => {
      const query = {
        and: jest.fn().mockReturnThis(),
      } as unknown as ThisParameterType<
        typeof PokerRoomSchemaModule.byCanPlayerSit
      >;
      const playerId = "playerIdValue";
      const result = PokerRoomSchemaModule.byCanPlayerSit.call(
        query,
        playerId,
        true
      );
      expect(query.and).toBeCalledTimes(1);
      expect(query.and).toHaveBeenCalledWith([
        {
          playerIdsCount: {
            $lt: PokerRoomSchemaModule.MAX_PLAYER_IDS_LENGTH,
          },
        },
        { playerIds: { $ne: playerId } },
      ]);
      expect(result).toBe(query);
    });

    test("when canSit is false", () => {
      const query = {
        and: jest.fn().mockReturnThis(),
      } as unknown as ThisParameterType<
        typeof PokerRoomSchemaModule.byCanPlayerSit
      >;
      const playerId = "playerIdValue";
      const result = PokerRoomSchemaModule.byCanPlayerSit.call(
        query,
        playerId,
        false
      );
      expect(query.and).toBeCalledTimes(1);
      expect(query.and).toHaveBeenCalledWith([
        {
          $or: [
            {
              playerIdsCount: {
                $gte: PokerRoomSchemaModule.MAX_PLAYER_IDS_LENGTH,
              },
            },
            { playerIds: playerId },
          ],
        },
      ]);
      expect(result).toBe(query);
    });
  });

  describe("byIsPlayerSeated suceeds", () => {
    test("when isSeated is true", () => {
      const query = {
        and: jest.fn().mockReturnThis(),
      } as unknown as ThisParameterType<
        typeof PokerRoomSchemaModule.byIsPlayerSeated
      >;
      const playerId = "playerIdValue";
      const result = PokerRoomSchemaModule.byIsPlayerSeated.call(
        query,
        playerId,
        true
      );
      expect(query.and).toBeCalledTimes(1);
      expect(query.and).toHaveBeenCalledWith([{ playerIds: playerId }]);
      expect(result).toBe(query);
    });

    test("when isSeated is false", () => {
      const query = {
        and: jest.fn().mockReturnThis(),
      } as unknown as ThisParameterType<
        typeof PokerRoomSchemaModule.byIsPlayerSeated
      >;
      const playerId = "playerIdValue";
      const result = PokerRoomSchemaModule.byIsPlayerSeated.call(
        query,
        playerId,
        false
      );
      expect(query.and).toBeCalledTimes(1);
      expect(query.and).toHaveBeenCalledWith([
        { playerIds: { $ne: playerId } },
      ]);
      expect(result).toBe(query);
    });
  });
});

describe("virtuals", () => {
  describe("virtualTableSetter sets this.playerIds, this.playerIdsCount, this.serializedTable, this.deserializedTable when given", () => {
    test.each(tableCases)("$description", ({ create }) => {
      const table = create();
      const obj: ThisParameterType<
        typeof PokerRoomSchemaModule.virtualTableSetter
      > = {};
      PokerRoomSchemaModule.virtualTableSetter.call(obj, table);

      const { deserializedTable, ...rest } = obj;

      expect({ ...rest }).toStrictEqual({
        playerIds: PokerRoomSchemaModule.getPlayerIds(table),
        playerIdsCount: PokerRoomSchemaModule.getPlayerIds(table).length,
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
      playerIdsCount,
    } = new TestPokerRoomModel(constructorArg);
    expect(name).toBe(constructorArg.name);
    expect(creatorId).toBe(constructorArg.creatorId);
    expect(table).toBe(constructorArg.table);
    expect(serializedTable).toStrictEqual(serialize(constructorArg.table));
    expect(playerIds).toStrictEqual(
      PokerRoomSchemaModule.getPlayerIds(constructorArg.table)
    );
    expect(playerIdsCount).toBe(playerIds?.length);
  });
});
