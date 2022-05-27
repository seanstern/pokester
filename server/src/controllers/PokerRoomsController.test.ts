import { getMockReq, getMockRes } from "@jest-mock/express";
import {
  create,
  CreateReqBody,
  get,
  GetReqParams,
} from "./PokerRoomsController";
import PokerRoom from "../models/PokerRoom";
import { flop } from "../__fixtures__/poker-engine/Table.fixture";

describe("create", () => {
  test("succeeds", async () => {
    const body: CreateReqBody = {
      name: "some name",
      buyIn: 3000,
      smallBlind: 30,
      bigBlind: 90,
    };
    const req = getMockReq<Parameters<typeof create>[0]>({
      sessionId: "sessionId",
      body,
    });
    const { res, next } = getMockRes<Parameters<typeof create>[1]>();

    const saveMock = jest
      .spyOn(PokerRoom.prototype, "save")
      .mockImplementation(function (this: any) {
        return Promise.resolve(this);
      });

    await create(req, res, next);

    expect(saveMock).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(expect.any(String));
  });
});

describe("get", () => {
  test("succeeds", async () => {
    const params: GetReqParams = {
      id: "roomId",
    };
    const req = getMockReq<Parameters<typeof get>[0]>({
      sessionId: "sessionId",
      params,
    });
    const { res, next } = getMockRes<Parameters<typeof get>[1]>();

    const findOneMock = jest.spyOn(PokerRoom, "findOne").mockReturnValue({
      exec: jest.fn().mockResolvedValue({ table: flop.create() }),
    } as any);

    await get(req, res, next);

    expect(findOneMock).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect((res.json as jest.Mock).mock.lastCall).toMatchInlineSnapshot(`
      Array [
        Object {
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
              "holeCards": undefined,
              "id": "Jay",
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
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
                  "holeCards": undefined,
                  "id": "Jay",
                  "isSelf": false,
                  "left": false,
                  "legalActions": undefined,
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
      ]
    `);
  });
});
