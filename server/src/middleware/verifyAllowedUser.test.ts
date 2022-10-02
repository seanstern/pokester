import verifyAllowedUser, { notAllowed } from "./verifyAllowedUser";
import AllowedUser from "../models/allowed-user";
import { getMockReq, getMockRes } from "@jest-mock/express";

const email = "foo@bar.com";
const mockFindOneExec = jest.fn().mockResolvedValue(new AllowedUser({ email }));
jest
  .spyOn(AllowedUser, "findOne")
  .mockReturnValue({ exec: mockFindOneExec } as any);

test("succeeds", async () => {
  const req = getMockReq({
    oidc: { idTokenClaims: { email } },
  });
  const { res, next } = getMockRes();

  await verifyAllowedUser(req, res, next);

  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
  expect(next).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenCalledWith();
});

describe("fails", () => {
  test("beause user not allowed", async () => {
    mockFindOneExec.mockResolvedValueOnce(null);
    const req = getMockReq({
      oidc: { idTokenClaims: { email } },
    });
    const { res, next } = getMockRes();

    await verifyAllowedUser(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(notAllowed);
  });

  test("beause of unexpected error", async () => {
    mockFindOneExec.mockRejectedValueOnce(new Error("unexpected error"));
    const req = getMockReq({
      oidc: { idTokenClaims: { email } },
    });
    const { res, next } = getMockRes();

    await verifyAllowedUser(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
