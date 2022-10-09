import { getMockReq, getMockRes } from "@jest-mock/express";
import { PlayerAction } from "@pokester/common-api/poker-rooms/act";
import {
  flop,
  onePlayerSeated,
  playersSeated,
} from "@pokester/poker-engine-fixtures/table";
import RegistrationExtension from "../../middleware/request-extensions/RegistrationExtension";
import PokerRoom from "../../models/PokerRoom/index";
import act, {
  BadRequestMessage,
  pokerRoomNotFound,
  ReqBody,
  ReqParams,
} from "./act";

const mockRegistrationExtensionGet = jest.spyOn(RegistrationExtension, "get");

const mockSave = jest
  .spyOn(PokerRoom.prototype, "save")
  .mockImplementation(function (this: any) {
    return Promise.resolve(this);
  });

const mockDeleteOne = jest
  .spyOn(PokerRoom, "deleteOne")
  .mockReturnValue(Promise.resolve() as any);

const name = "tableName";
const { currentActor, bigBlind, players } = flop.create();
if (!currentActor) {
  throw new Error("table needs currentActor");
}

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

describe("succeeds", () => {
  test("when dealer deals", async () => {
    const dealerId = playersSeated.create().dealer?.id;
    const mockExec = jest.fn().mockImplementation(() => {
      const table = playersSeated.create();
      return new PokerRoom({
        name,
        creatorId: currentActor.id,
        table,
      });
    });
    mockFindOne.mockReturnValueOnce({ exec: mockExec } as any);
    mockRegistrationExtensionGet.mockReturnValueOnce({
      user: { username: dealerId },
    } as any);

    const req = getMockReq<Parameters<typeof act>[0]>({
      user: { username: dealerId },
      params: roomIdParam,
      body: { action: PlayerAction.DEAL },
    });

    const { res, next } = getMockRes<Parameters<typeof act>[1]>();

    await act(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockDeleteOne).not.toHaveBeenCalled();
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockFindOne).toHaveBeenCalledWith({ _id: roomIdParam.roomId });
    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith();
  });

  const actionCaseTable: [string, ReqBody][] = [
    ["checks", { action: PlayerAction.CHECK }],
    ["bets", { action: PlayerAction.BET, amount: bigBlind }],
    ["raises", { action: PlayerAction.RAISE, amount: bigBlind }],
    ["folds", { action: PlayerAction.FOLD }],
    ["stands", { action: PlayerAction.STAND }],
  ];
  test.each(actionCaseTable)("when existing player %s", async (_, body) => {
    mockRegistrationExtensionGet.mockReturnValueOnce({
      user: { username: currentActor.id },
    } as any);

    const params: ReqParams = roomIdParam;
    const req = getMockReq<Parameters<typeof act>[0]>({ params, body });
    const { res, next } = getMockRes<Parameters<typeof act>[1]>();

    await act(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockDeleteOne).not.toHaveBeenCalled();
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockFindOne).toHaveBeenCalledWith({ _id: roomIdParam.roomId });
    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith();
  });

  test("when new player sits", async () => {
    const username = "newPlayerId";
    if (players.find((player) => player?.id === username)) {
      throw new Error(`table should not have ${username} seated`);
    }

    mockRegistrationExtensionGet.mockReturnValueOnce({
      user: { username },
    } as any);

    const params: ReqParams = roomIdParam;
    const body: ReqBody = {
      action: PlayerAction.SIT,
    };

    const req = getMockReq<Parameters<typeof act>[0]>({ params, body });
    const { res, next } = getMockRes<Parameters<typeof act>[1]>();

    await act(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockDeleteOne).not.toHaveBeenCalled();
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockFindOne).toHaveBeenCalledWith({ _id: roomIdParam.roomId });
    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith();
  });

  test("and deletes room when last player stands", async () => {
    const table = onePlayerSeated.create();
    const onlyPlayerId = table.players.find((p) => !!p)?.id;
    if (!onlyPlayerId) {
      throw new Error("player should exist");
    }

    mockRegistrationExtensionGet.mockReturnValueOnce({
      user: { username: onlyPlayerId },
    } as any);

    const pokerRoom = new PokerRoom({ name, table, creatorId: onlyPlayerId });

    mockFindOneExec.mockResolvedValueOnce(pokerRoom);

    const params: ReqParams = roomIdParam;
    const body: ReqBody = {
      action: PlayerAction.STAND,
    };

    const req = getMockReq<Parameters<typeof act>[0]>({ params, body });
    const { res, next } = getMockRes<Parameters<typeof act>[1]>();

    await act(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockSave).not.toHaveBeenCalled();
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockFindOne).toHaveBeenCalledWith({ _id: roomIdParam.roomId });
    expect(mockDeleteOne).toHaveBeenCalledTimes(1);
    expect(mockDeleteOne).toHaveBeenCalledWith({ _id: pokerRoom._id });
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith();
  });
});

describe("fails", () => {
  test("when PokerRoom not found", async () => {
    mockFindOneExec.mockResolvedValueOnce(null);
    mockRegistrationExtensionGet.mockReturnValueOnce({
      user: { username: "anyusername" },
    } as any);

    const params: ReqParams = roomIdParam;
    const body: ReqBody = {
      action: PlayerAction.CHECK,
    };

    const req = getMockReq<Parameters<typeof act>[0]>({ params, body });
    const { res, next } = getMockRes<Parameters<typeof act>[1]>();

    await act(req, res, next);

    expect(mockSave).not.toHaveBeenCalled();
    expect(mockDeleteOne).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(pokerRoomNotFound);
  });

  test("when existing player sits", async () => {
    mockRegistrationExtensionGet.mockReturnValueOnce({
      user: { username: currentActor.id },
    } as any);

    const params: ReqParams = roomIdParam;
    const body: ReqBody = {
      action: PlayerAction.SIT,
    };

    const req = getMockReq<Parameters<typeof act>[0]>({ params, body });
    const { res, next } = getMockRes<Parameters<typeof act>[1]>();

    await act(req, res, next);

    expect(mockSave).not.toHaveBeenCalled();
    expect(mockDeleteOne).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(BadRequestMessage.SIT_ALREADY_SEATED);
  });

  test("when new player stands", async () => {
    const username = "newplayerusername";
    if (players.find((player) => player?.id === username)) {
      throw new Error(`table should not have ${username} seated`);
    }
    mockRegistrationExtensionGet.mockReturnValueOnce({
      user: { username: "newplayerusername" },
    } as any);

    const params: ReqParams = roomIdParam;
    const body: ReqBody = {
      action: PlayerAction.STAND,
    };

    const req = getMockReq<Parameters<typeof act>[0]>({ params, body });
    const { res, next } = getMockRes<Parameters<typeof act>[1]>();

    await act(req, res, next);

    expect(mockSave).not.toHaveBeenCalled();
    expect(mockDeleteOne).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(BadRequestMessage.ACTION_UNSEATED);
  });

  test("when player is not currentActor folds", async () => {
    const { id: username } =
      players.find((player) => player && player !== currentActor) || {};
    if (!username) {
      throw new Error(
        "table should contain at least one other player besides currentActor"
      );
    }
    mockRegistrationExtensionGet.mockReturnValueOnce({
      user: { username },
    } as any);

    const params: ReqParams = roomIdParam;
    const body: ReqBody = {
      action: PlayerAction.FOLD,
    };

    const req = getMockReq<Parameters<typeof act>[0]>({ params, body });
    const { res, next } = getMockRes<Parameters<typeof act>[1]>();

    await act(req, res, next);

    expect(mockSave).not.toHaveBeenCalled();
    expect(mockDeleteOne).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(BadRequestMessage.ACTION_OUT_OF_TURN);
  });

  test("when action is invalid", async () => {
    mockRegistrationExtensionGet.mockReturnValueOnce({
      user: { username: currentActor.id },
    } as any);

    const params: ReqParams = roomIdParam;
    const invalidActionValue = "invalidActionValue";
    if (Object.values(PlayerAction).includes(invalidActionValue as any)) {
      throw new Error(`${invalidActionValue} is a PlayerAction`);
    }
    const body = { action: invalidActionValue };

    const req = getMockReq<Parameters<typeof act>[0]>({ params, body });
    const { res, next } = getMockRes<Parameters<typeof act>[1]>();

    await act(req, res, next);

    expect(mockSave).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenLastCalledWith(expect.any(Error));
  });

  test("when currentActor illegally calls", async () => {
    if (currentActor.legalActions().includes(PlayerAction.CALL)) {
      throw new Error("currentActor should not be able to call");
    }

    mockRegistrationExtensionGet.mockReturnValueOnce({
      user: { username: currentActor.id },
    } as any);

    const params: ReqParams = roomIdParam;
    const body: ReqBody = {
      action: PlayerAction.CALL,
    };

    const req = getMockReq<Parameters<typeof act>[0]>({ params, body });
    const { res, next } = getMockRes<Parameters<typeof act>[1]>();

    await act(req, res, next);

    expect(mockSave).not.toHaveBeenCalled();
    expect(mockDeleteOne).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(BadRequestMessage.ACTION_ILLEGAL);
  });

  test("when player illegally deals", async () => {
    mockRegistrationExtensionGet.mockReturnValueOnce({
      user: { username: currentActor.id },
    } as any);

    const params: ReqParams = roomIdParam;
    const body: ReqBody = {
      action: PlayerAction.DEAL,
    };

    const req = getMockReq<Parameters<typeof act>[0]>({ params, body });
    const { res, next } = getMockRes<Parameters<typeof act>[1]>();

    await act(req, res, next);

    expect(mockSave).not.toHaveBeenCalled();
    expect(mockDeleteOne).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(BadRequestMessage.ACTION_ILLEGAL);
  });
});
