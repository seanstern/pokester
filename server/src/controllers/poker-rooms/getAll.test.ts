import { getMockReq, getMockRes } from "@jest-mock/express";
import { flop, playersSeated } from "@pokester/poker-engine-fixtures/table";
import { Types } from "mongoose";
import RegistrationExtension from "../../middleware/request-extensions/RegistrationExtension";
import PokerRoom from "../../models/PokerRoom/index";
import getAll, { prefixMatchQueryOp } from "./getAll";

const username = "usernameValue";
jest
  .spyOn(RegistrationExtension, "get")
  .mockReturnValue({ user: { username } } as any);

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

describe("succeeds", () => {
  const resJsonCalledWith = mockFindExecResolution.map((pr) => ({
    id: pr.id,
    name: pr.name,
    creatorId: pr.creatorId,
    canSit: pr.canSit(username),
    isSeated: pr.isSeated(username),
  }));

  test("with creatorId query param", async () => {
    const query = { creatorId: "creatorVal" };
    const req = getMockReq<Parameters<typeof getAll>[0]>({ query });
    const { res, next } = getMockRes<Parameters<typeof getAll>[1]>();

    await getAll(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockFindByCanPlayerSit).not.toHaveBeenCalled();
    expect(mockFindByIsPlayerSeated).not.toHaveBeenCalled();
    expect(mockFind).toHaveBeenCalledTimes(1);
    expect(mockFind).toHaveBeenCalledWith();
    expect(mockFindWhere).toHaveBeenCalledTimes(1);
    expect(mockFindWhere).toHaveBeenCalledWith({
      creatorId: prefixMatchQueryOp(query.creatorId),
    });
    expect(mockFindSelect).toHaveBeenCalledTimes(1);
    expect(mockFindSelect).toHaveBeenCalledWith({
      name: 1,
      playerIds: 1,
      creatorId: 1,
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
    const req = getMockReq<Parameters<typeof getAll>[0]>({ query });
    const { res, next } = getMockRes<Parameters<typeof getAll>[1]>();

    await getAll(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockFindByCanPlayerSit).not.toHaveBeenCalled();
    expect(mockFindByIsPlayerSeated).not.toHaveBeenCalled();
    expect(mockFind).toHaveBeenCalledTimes(1);
    expect(mockFind).toHaveBeenCalledWith();
    expect(mockFindWhere).toHaveBeenCalledTimes(1);
    expect(mockFindWhere).toHaveBeenCalledWith({
      name: prefixMatchQueryOp(query.name),
    });
    expect(mockFindSelect).toHaveBeenCalledTimes(1);
    expect(mockFindSelect).toHaveBeenCalledWith({
      name: 1,
      playerIds: 1,
      creatorId: 1,
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
    const req = getMockReq<Parameters<typeof getAll>[0]>({ query });
    const { res, next } = getMockRes<Parameters<typeof getAll>[1]>();

    await getAll(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockFindWhere).not.toHaveBeenCalled();
    expect(mockFindByIsPlayerSeated).not.toHaveBeenCalled();
    expect(mockFind).toHaveBeenCalledTimes(1);
    expect(mockFind).toHaveBeenCalledWith();
    expect(mockFindByCanPlayerSit).toHaveBeenCalledTimes(1);
    expect(mockFindByCanPlayerSit).toHaveBeenCalledWith(username, true);
    expect(mockFindSelect).toHaveBeenCalledTimes(1);
    expect(mockFindSelect).toHaveBeenCalledWith({
      name: 1,
      playerIds: 1,
      creatorId: 1,
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
    const req = getMockReq<Parameters<typeof getAll>[0]>({ query });
    const { res, next } = getMockRes<Parameters<typeof getAll>[1]>();

    await getAll(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockFindWhere).not.toHaveBeenCalled();
    expect(mockFindByCanPlayerSit).not.toHaveBeenCalled();
    expect(mockFind).toHaveBeenCalledTimes(1);
    expect(mockFind).toHaveBeenCalledWith();
    expect(mockFindByIsPlayerSeated).toHaveBeenCalledTimes(1);
    expect(mockFindByIsPlayerSeated).toHaveBeenCalledWith(username, false);
    expect(mockFindSelect).toHaveBeenCalledTimes(1);
    expect(mockFindSelect).toHaveBeenCalledWith({
      name: 1,
      playerIds: 1,
      creatorId: 1,
    });
    expect(mockFindExec).toHaveBeenCalledTimes(1);
    expect(mockFindExec).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(resJsonCalledWith);
  });
});
