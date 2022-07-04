import { getMockReq, getMockRes } from "@jest-mock/express";
import { Routes } from "@pokester/common-api";
import { NextFunction } from "express";
import { Types } from "mongoose";
import PokerRoom from "../models/PokerRoom";
import {
  flop,
  playersSeated,
} from "../__fixtures__/poker-engine/Table.fixture";
import {
  create,
  CreateReqBody,
  get,
  GetReqParams,
  act,
  ActReqParams,
  ActReqBody,
  getAll,
  GetAllReqQuery,
} from "./PokerRoomsController";

// Common mocks
const mockSave = jest
  .spyOn(PokerRoom.prototype, "save")
  .mockImplementation(function (this: any) {
    return Promise.resolve(this);
  });

const name = "tableName";
const { currentActor, bigBlind, players } = flop.create();
if (!currentActor) {
  throw new Error("table needs currentActor");
}
const sessionID = currentActor.id;
const mockFindOneExec = jest.fn().mockImplementation(() => {
  const table = flop.create();
  return Promise.resolve(
    new PokerRoom({
      name,
      creatorId: sessionID,
      table,
    })
  );
});
const mockFindOne = jest.spyOn(PokerRoom, "findOne").mockReturnValue({
  exec: mockFindOneExec,
} as any);

const mockFindExecResolution = [
  new PokerRoom({
    // For consistent snapshot testing
    _id: new Types.ObjectId("62af64bf997b2897074abe6c"),
    name: flop.description,
    creatorId: "creatorIdVal0",
    table: flop.create(),
  }),
  new PokerRoom({
    // For consistent snapshot testing
    _id: new Types.ObjectId("62af64bf997b2897074abe6d"),
    name: playersSeated.description,
    creatorId: "creatorIdVal1",
    table: playersSeated.create(),
  }),
];
const mockFindExec = jest.fn(() => Promise.resolve(mockFindExecResolution));
const mockFindWhere = jest.fn().mockReturnThis();
const mockFindByCanPlayerSit = jest.fn().mockReturnThis();
const mockFindByIsPlayerSeated = jest.fn().mockReturnThis();
const mockFindSelect = jest.fn().mockReturnThis();
const mockFind = jest.spyOn(PokerRoom, "find").mockImplementation(
  () =>
    ({
      exec: mockFindExec,
      where: mockFindWhere,
      byCanPlayerSit: mockFindByCanPlayerSit,
      byIsPlayerSeated: mockFindByIsPlayerSeated,
      select: mockFindSelect,
    } as any)
);

// Common params
const roomIdParam = {
  roomId: "roomId",
};

describe("create", () => {
  test("succeeds", async () => {
    const body: CreateReqBody = {
      name: "some name",
      buyIn: 3000,
      smallBlind: 30,
      bigBlind: 90,
    };
    const req = getMockReq<Parameters<typeof create>[0]>({
      sessionID,
      body,
    });
    const { res, next } = getMockRes<Parameters<typeof create>[1]>();

    await create(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(expect.any(String));
  });

  test("fails", async () => {
    mockSave.mockRejectedValueOnce(new Error());

    const body: CreateReqBody = {
      name: "some name",
      buyIn: 3000,
      smallBlind: 30,
      bigBlind: 90,
    };
    const req = getMockReq<Parameters<typeof create>[0]>({
      sessionID,
      body,
    });
    const { res, next } = getMockRes<Parameters<typeof create>[1]>();

    await create(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe("getAll", () => {
  describe("succeeds", () => {
    const resJsonCalledWith = mockFindExecResolution.map((pr) => ({
      id: pr.id,
      name: pr.name,
      canSit: pr.canSit(sessionID),
      isSeated: pr.isSeated(sessionID),
    }));

    test("with creatorId query param", async () => {
      const query = { creatorId: "creatorVal" };
      const req = getMockReq<Parameters<typeof getAll>[0]>({
        sessionID,
        query,
      });
      const { res, next } = getMockRes<Parameters<typeof getAll>[1]>();

      await getAll(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(mockFindByCanPlayerSit).not.toHaveBeenCalled();
      expect(mockFindByIsPlayerSeated).not.toHaveBeenCalled();
      expect(mockFind).toHaveBeenCalledTimes(1);
      expect(mockFind).toHaveBeenCalledWith();
      expect(mockFindWhere).toHaveBeenCalledTimes(1);
      expect(mockFindWhere).toHaveBeenCalledWith(query);
      expect(mockFindSelect).toHaveBeenCalledTimes(1);
      expect(mockFindSelect).toHaveBeenCalledWith({
        name: 1,
        playerIds: 1,
      });
      expect(mockFindExec).toHaveBeenCalledTimes(1);
      expect(mockFindExec).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(resJsonCalledWith);
    });

    test("with name query param", async () => {
      const query = { name: "nameVal" };
      const req = getMockReq<Parameters<typeof getAll>[0]>({
        sessionID,
        query,
      });
      const { res, next } = getMockRes<Parameters<typeof getAll>[1]>();

      await getAll(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(mockFindByCanPlayerSit).not.toHaveBeenCalled();
      expect(mockFindByIsPlayerSeated).not.toHaveBeenCalled();
      expect(mockFind).toHaveBeenCalledTimes(1);
      expect(mockFind).toHaveBeenCalledWith();
      expect(mockFindWhere).toHaveBeenCalledTimes(1);
      expect(mockFindWhere).toHaveBeenCalledWith(query);
      expect(mockFindSelect).toHaveBeenCalledTimes(1);
      expect(mockFindSelect).toHaveBeenCalledWith({
        name: 1,
        playerIds: 1,
      });
      expect(mockFindExec).toHaveBeenCalledTimes(1);
      expect(mockFindExec).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(resJsonCalledWith);
    });

    test("with canSit query param", async () => {
      const query = { canSit: "true" };
      const req = getMockReq<Parameters<typeof getAll>[0]>({
        sessionID,
        query,
      });
      const { res, next } = getMockRes<Parameters<typeof getAll>[1]>();

      await getAll(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(mockFindWhere).not.toHaveBeenCalled();
      expect(mockFindByIsPlayerSeated).not.toHaveBeenCalled();
      expect(mockFind).toHaveBeenCalledTimes(1);
      expect(mockFind).toHaveBeenCalledWith();
      expect(mockFindByCanPlayerSit).toHaveBeenCalledTimes(1);
      expect(mockFindByCanPlayerSit).toHaveBeenCalledWith(sessionID, true);
      expect(mockFindSelect).toHaveBeenCalledTimes(1);
      expect(mockFindSelect).toHaveBeenCalledWith({
        name: 1,
        playerIds: 1,
      });
      expect(mockFindExec).toHaveBeenCalledTimes(1);
      expect(mockFindExec).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(resJsonCalledWith);
    });

    test("with isSeated query param", async () => {
      const query = { isSeated: "false" };
      const req = getMockReq<Parameters<typeof getAll>[0]>({
        sessionID,
        query,
      });
      const { res, next } = getMockRes<Parameters<typeof getAll>[1]>();

      await getAll(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(mockFindWhere).not.toHaveBeenCalled();
      expect(mockFindByCanPlayerSit).not.toHaveBeenCalled();
      expect(mockFind).toHaveBeenCalledTimes(1);
      expect(mockFind).toHaveBeenCalledWith();
      expect(mockFindByIsPlayerSeated).toHaveBeenCalledTimes(1);
      expect(mockFindByIsPlayerSeated).toHaveBeenCalledWith(sessionID, false);
      expect(mockFindSelect).toHaveBeenCalledTimes(1);
      expect(mockFindSelect).toHaveBeenCalledWith({
        name: 1,
        playerIds: 1,
      });
      expect(mockFindExec).toHaveBeenCalledTimes(1);
      expect(mockFindExec).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(resJsonCalledWith);
    });
  });
});

describe("get", () => {
  test("succeeds", async () => {
    const params: GetReqParams = roomIdParam;
    const req = getMockReq<Parameters<typeof get>[0]>({
      sessionID,
      params,
    });
    const { res, next } = getMockRes<Parameters<typeof get>[1]>();

    await get(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockFindOneExec).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect((res.json as jest.Mock).mock.lastCall).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "roomId",
          "name": "tableName",
          "table": Object {
            "bigBlind": 10,
            "bigBlindPosition": 0,
            "buyIn": 1000,
            "communityCards": Array [
              Object {
                "color": "#000000",
                "rank": "T",
                "suit": "s",
                "suitChar": "♠",
              },
              Object {
                "color": "#000000",
                "rank": "J",
                "suit": "s",
                "suitChar": "♠",
              },
              Object {
                "color": "#000000",
                "rank": "Q",
                "suit": "s",
                "suitChar": "♠",
              },
            ],
            "currentBet": undefined,
            "currentPosition": 7,
            "currentRound": "flop",
            "dealerPosition": 3,
            "handNumber": 1,
            "players": Array [
              Object {
                "bet": 0,
                "folded": false,
                "holeCards": undefined,
                "id": "Jane",
                "isSelf": false,
                "left": false,
                "legalActions": undefined,
                "stackSize": 2990,
              },
              Object {
                "bet": 0,
                "folded": false,
                "holeCards": undefined,
                "id": "Juan",
                "isSelf": false,
                "left": false,
                "legalActions": undefined,
                "stackSize": 9189,
              },
              null,
              Object {
                "bet": 0,
                "folded": false,
                "holeCards": undefined,
                "id": "John",
                "isSelf": false,
                "left": false,
                "legalActions": undefined,
                "stackSize": 1990,
              },
              null,
              null,
              null,
              Object {
                "bet": 0,
                "folded": false,
                "holeCards": Array [
                  Object {
                    "color": "#000000",
                    "rank": "8",
                    "suit": "s",
                    "suitChar": "♠",
                  },
                  Object {
                    "color": "#000000",
                    "rank": "9",
                    "suit": "s",
                    "suitChar": "♠",
                  },
                ],
                "id": "Jay",
                "isSelf": true,
                "left": false,
                "legalActions": Array [
                  "stand",
                  "check",
                  "bet",
                  "fold",
                ],
                "stackSize": 31405,
              },
              null,
              null,
            ],
            "pots": Array [
              Object {
                "amount": 40,
                "eligiblePlayers": Array [
                  Object {
                    "bet": 0,
                    "folded": false,
                    "holeCards": undefined,
                    "id": "Jane",
                    "isSelf": false,
                    "left": false,
                    "legalActions": undefined,
                    "stackSize": 2990,
                  },
                  Object {
                    "bet": 0,
                    "folded": false,
                    "holeCards": undefined,
                    "id": "Juan",
                    "isSelf": false,
                    "left": false,
                    "legalActions": undefined,
                    "stackSize": 9189,
                  },
                  Object {
                    "bet": 0,
                    "folded": false,
                    "holeCards": undefined,
                    "id": "John",
                    "isSelf": false,
                    "left": false,
                    "legalActions": undefined,
                    "stackSize": 1990,
                  },
                  Object {
                    "bet": 0,
                    "folded": false,
                    "holeCards": Array [
                      Object {
                        "color": "#000000",
                        "rank": "8",
                        "suit": "s",
                        "suitChar": "♠",
                      },
                      Object {
                        "color": "#000000",
                        "rank": "9",
                        "suit": "s",
                        "suitChar": "♠",
                      },
                    ],
                    "id": "Jay",
                    "isSelf": true,
                    "left": false,
                    "legalActions": Array [
                      "stand",
                      "check",
                      "bet",
                      "fold",
                    ],
                    "stackSize": 31405,
                  },
                ],
                "winners": undefined,
              },
            ],
            "smallBlind": 5,
            "smallBlindPosition": 7,
            "winners": undefined,
          },
        },
      ]
    `);
  });

  test("fails", async () => {
    mockFindOneExec.mockResolvedValueOnce(null);

    const params: GetReqParams = roomIdParam;
    const req = getMockReq<Parameters<typeof get>[0]>({
      sessionID,
      params,
    });
    const { res, next } = getMockRes<Parameters<typeof get>[1]>();

    await get(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe("act", () => {
  describe("succeeds", () => {
    test("when dealer deals", async () => {
      const dealerId = playersSeated.create().dealer?.id;
      const mockExec = jest.fn().mockImplementation(() => {
        const table = playersSeated.create();
        return new PokerRoom({
          name,
          creatorId: sessionID,
          table,
        });
      });
      mockFindOne.mockReturnValueOnce({
        exec: mockExec,
      } as any);

      // Ignore getMockReq type parameter because typing is
      // overly restrictive (i.e. doesn't allow never in
      // ResponseBody)
      const req = getMockReq({
        sessionID: dealerId,
        params: roomIdParam,
        body: { action: Routes.PokerRooms.Act.PlayerAction.DEAL },
      }) as Parameters<typeof act>[0];

      // Ignore getMockRes type parameter because typing is
      // overly restrictive (i.e. doesn't allow never in
      // ResponseBody)
      const { res, next } = getMockRes() as unknown as {
        res: Parameters<typeof act>[1];
        next: NextFunction;
      };

      await act(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalledTimes(1);
      expect(res.end).toHaveBeenCalledWith();
    });

    const actionCaseTable: [string, ActReqBody][] = [
      ["checks", { action: Routes.PokerRooms.Act.PlayerAction.CHECK }],
      [
        "bets",
        { action: Routes.PokerRooms.Act.PlayerAction.BET, amount: bigBlind },
      ],
      [
        "raises",
        { action: Routes.PokerRooms.Act.PlayerAction.RAISE, amount: bigBlind },
      ],
      ["folds", { action: Routes.PokerRooms.Act.PlayerAction.FOLD }],
      ["stands", { action: Routes.PokerRooms.Act.PlayerAction.STAND }],
    ];
    test.each(actionCaseTable)("when existing player %s", async (_, body) => {
      const params: ActReqParams = roomIdParam;
      // Ignore getMockReq type parameter because typing is
      // overly restrictive (i.e. doesn't allow never in
      // ResponseBody)
      const req = getMockReq({
        sessionID,
        params,
        body,
      }) as Parameters<typeof act>[0];
      // Ignore getMockRes type parameter because typing is
      // overly restrictive (i.e. doesn't allow never in
      // ResponseBody)
      const { res, next } = getMockRes() as unknown as {
        res: Parameters<typeof act>[1];
        next: NextFunction;
      };

      await act(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalledTimes(1);
      expect(res.end).toHaveBeenCalledWith();
    });

    test("when new player sits", async () => {
      const params: ActReqParams = roomIdParam;
      const body: ActReqBody = {
        action: Routes.PokerRooms.Act.PlayerAction.SIT,
      };
      const sessionID = "newPlayerId";
      if (players.find((player) => player?.id === sessionID)) {
        throw new Error(`table should not have ${sessionID} seated`);
      }

      // Ignore getMockReq type parameter because typing is
      // overly restrictive (i.e. doesn't allow never in
      // ResponseBody)
      const req = getMockReq({
        sessionID,
        params,
        body,
      }) as Parameters<typeof act>[0];
      // Ignore getMockRes type parameter because typing is
      // overly restrictive (i.e. doesn't allow never in
      // ResponseBody)
      const { res, next } = getMockRes() as unknown as {
        res: Parameters<typeof act>[1];
        next: NextFunction;
      };

      await act(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalledTimes(1);
      expect(res.end).toHaveBeenCalledWith();
    });
  });

  describe("fails", () => {
    test("when PokerRoom not found", async () => {
      mockFindOneExec.mockResolvedValueOnce(null);

      const params: ActReqParams = roomIdParam;
      const body: ActReqBody = {
        action: Routes.PokerRooms.Act.PlayerAction.CHECK,
      };
      // Ignore getMockReq type parameter because typing is
      // overly restrictive (i.e. doesn't allow never in
      // ResponseBody)
      const req = getMockReq({
        sessionID,
        params,
        body,
      }) as Parameters<typeof act>[0];
      // Ignore getMockRes type parameter because typing is
      // overly restrictive (i.e. doesn't allow never in
      // ResponseBody)
      const { res, next } = getMockRes() as unknown as {
        res: Parameters<typeof act>[1];
        next: NextFunction;
      };

      await act(req, res, next);

      expect(mockSave).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    test("when existing player sits", async () => {
      const params: ActReqParams = roomIdParam;
      const body: ActReqBody = {
        action: Routes.PokerRooms.Act.PlayerAction.SIT,
      };

      // Ignore getMockReq type parameter because typing is
      // overly restrictive (i.e. doesn't allow never in
      // ResponseBody)
      const req = getMockReq({
        sessionID,
        params,
        body,
      }) as Parameters<typeof act>[0];
      // Ignore getMockRes type parameter because typing is
      // overly restrictive (i.e. doesn't allow never in
      // ResponseBody)
      const { res, next } = getMockRes() as unknown as {
        res: Parameters<typeof act>[1];
        next: NextFunction;
      };

      await act(req, res, next);

      expect(mockSave).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.end).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenLastCalledWith(expect.any(Error));
    });

    test("when new player stands", async () => {
      const params: ActReqParams = roomIdParam;
      const body: ActReqBody = {
        action: Routes.PokerRooms.Act.PlayerAction.STAND,
      };
      const sessionID = "newPlayerId";
      if (players.find((player) => player?.id === sessionID)) {
        throw new Error(`table should not have ${sessionID} seated`);
      }

      // Ignore getMockReq type parameter because typing is
      // overly restrictive (i.e. doesn't allow never in
      // ResponseBody)
      const req = getMockReq({
        sessionID,
        params,
        body,
      }) as Parameters<typeof act>[0];
      // Ignore getMockRes type parameter because typing is
      // overly restrictive (i.e. doesn't allow never in
      // ResponseBody)
      const { res, next } = getMockRes() as unknown as {
        res: Parameters<typeof act>[1];
        next: NextFunction;
      };

      await act(req, res, next);

      expect(mockSave).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.end).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenLastCalledWith(expect.any(Error));
    });

    test("when player is not currentActor folds", async () => {
      const params: ActReqParams = roomIdParam;
      const body: ActReqBody = {
        action: Routes.PokerRooms.Act.PlayerAction.FOLD,
      };
      // Ignore getMockReq type parameter because typing is
      // overly restrictive (i.e. doesn't allow never in
      // ResponseBody)
      const req = getMockReq({
        sessionID: "notCurrentActorId",
        params,
        body,
      }) as Parameters<typeof act>[0];
      // Ignore getMockRes type parameter because typing is
      // overly restrictive (i.e. doesn't allow never in
      // ResponseBody)
      const { res, next } = getMockRes() as unknown as {
        res: Parameters<typeof act>[1];
        next: NextFunction;
      };

      await act(req, res, next);

      expect(mockSave).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.end).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenLastCalledWith(expect.any(Error));
    });

    test("when action is invalid", async () => {
      const params: ActReqParams = roomIdParam;
      const invalidActionValue = "invalidActionValue";
      if (
        Object.values(Routes.PokerRooms.Act.PlayerAction).includes(
          invalidActionValue as any
        )
      ) {
        throw new Error(`${invalidActionValue} is a PlayerAction`);
      }
      const body = { action: invalidActionValue };

      // Ignore getMockReq type parameter because typing is
      // overly restrictive (i.e. doesn't allow never in
      // ResponseBody)
      const req = getMockReq({
        sessionID,
        params,
        body,
      }) as Parameters<typeof act>[0];
      // Ignore getMockRes type parameter because typing is
      // overly restrictive (i.e. doesn't allow never in
      // ResponseBody)
      const { res, next } = getMockRes() as unknown as {
        res: Parameters<typeof act>[1];
        next: NextFunction;
      };

      await act(req, res, next);

      expect(mockSave).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.end).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenLastCalledWith(expect.any(Error));
    });

    test("when player illegally calls", async () => {
      const params: ActReqParams = roomIdParam;
      const body: ActReqBody = {
        action: Routes.PokerRooms.Act.PlayerAction.CALL,
      };
      // Ignore getMockReq type parameter because typing is
      // overly restrictive (i.e. doesn't allow never in
      // ResponseBody)
      const req = getMockReq({
        sessionID,
        params,
        body,
      }) as Parameters<typeof act>[0];
      // Ignore getMockRes type parameter because typing is
      // overly restrictive (i.e. doesn't allow never in
      // ResponseBody)
      const { res, next } = getMockRes() as unknown as {
        res: Parameters<typeof act>[1];
        next: NextFunction;
      };

      await act(req, res, next);

      expect(mockSave).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.end).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenLastCalledWith(expect.any(Error));
    });

    test("when player illegally deals", async () => {
      const params: ActReqParams = roomIdParam;
      const body: ActReqBody = {
        action: Routes.PokerRooms.Act.PlayerAction.DEAL,
      };
      // Ignore getMockReq type parameter because typing is
      // overly restrictive (i.e. doesn't allow never in
      // ResponseBody)
      const req = getMockReq({
        sessionID,
        params,
        body,
      }) as Parameters<typeof act>[0];
      // Ignore getMockRes type parameter because typing is
      // overly restrictive (i.e. doesn't allow never in
      // ResponseBody)
      const { res, next } = getMockRes() as unknown as {
        res: Parameters<typeof act>[1];
        next: NextFunction;
      };

      await act(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.end).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenLastCalledWith(expect.any(Error));
    });
  });
});
