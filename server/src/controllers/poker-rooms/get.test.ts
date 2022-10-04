import { getMockReq, getMockRes } from "@jest-mock/express";
import { flop } from "@pokester/poker-engine-fixtures/table";
import PokerRoom from "../../models/PokerRoom/index";
import get, { ReqParams, pokerRoomNotFound } from "./get";
import RegistrationExtension from "../../middleware/request-extensions/RegistrationExtension";

const name = "tableName";
const { currentActor } = flop.create();
if (!currentActor) {
  throw new Error("table needs currentActor");
}
jest
  .spyOn(RegistrationExtension, "get")
  .mockReturnValue({ user: { username: currentActor.id } } as any);

const mockFindOneExec = jest.fn().mockImplementation(() => {
  const table = flop.create();
  return Promise.resolve(
    new PokerRoom({
      name,
      creatorId: currentActor.id,
      table,
    })
  );
});
const mockFindOne = jest.spyOn(PokerRoom, "findOne").mockReturnValue({
  exec: mockFindOneExec,
} as any);

const roomIdParam = {
  roomId: "roomId",
};

test("succeeds", async () => {
  const params: ReqParams = roomIdParam;
  const req = getMockReq<Parameters<typeof get>[0]>({ params });
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
          "canSit": false,
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
                "handDescr": undefined,
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
                "handDescr": undefined,
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
                "handDescr": undefined,
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
                "handDescr": "Straight Flush, Qs High",
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
                    "handDescr": undefined,
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
                    "handDescr": undefined,
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
                    "handDescr": undefined,
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
                    "handDescr": "Straight Flush, Qs High",
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

describe("fails", () => {
  test("not found", async () => {
    mockFindOneExec.mockResolvedValueOnce(null);

    const params: ReqParams = roomIdParam;
    const req = getMockReq<Parameters<typeof get>[0]>({ params });
    const { res, next } = getMockRes<Parameters<typeof get>[1]>();

    await get(req, res, next);

    expect(res.json).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockFindOneExec).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(pokerRoomNotFound);
  });

  test("unexpected error", async () => {
    mockFindOneExec.mockRejectedValueOnce(new Error("unexpected error"));

    const params: ReqParams = roomIdParam;
    const req = getMockReq<Parameters<typeof get>[0]>({ params });
    const { res, next } = getMockRes<Parameters<typeof get>[1]>();

    await get(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockFindOneExec).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
