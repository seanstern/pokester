import { getMockReq, getMockRes } from "@jest-mock/express";
import { create, CreateReqBody } from "./PokerRoomsController";
import PokerRoom from "../models/PokerRoom";

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
