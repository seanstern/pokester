import { getMockReq, getMockRes } from "@jest-mock/express";
import RegistrationExtension from "../../middleware/request-extensions/RegistrationExtension";
import PokerRoom from "../../models/PokerRoom/index";
import create, { ReqBody } from "./create";

const mockSave = jest
  .spyOn(PokerRoom.prototype, "save")
  .mockImplementation(function (this: any) {
    return Promise.resolve(this);
  });

const username = "usernameValue";
jest
  .spyOn(RegistrationExtension, "get")
  .mockReturnValue({ user: { username } } as any);

test("succeeds", async () => {
  const body: ReqBody = {
    name: "some name",
    buyIn: 3000,
    smallBlind: 30,
    bigBlind: 90,
  };
  const req = getMockReq<Parameters<typeof create>[0]>({ body });
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

  const body: ReqBody = {
    name: "some name",
    buyIn: 3000,
    smallBlind: 30,
    bigBlind: 90,
  };
  const req = getMockReq<Parameters<typeof create>[0]>({ body });
  const { res, next } = getMockRes<Parameters<typeof create>[1]>();

  await create(req, res, next);

  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  expect(mockSave).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenCalledWith(expect.any(Error));
});
