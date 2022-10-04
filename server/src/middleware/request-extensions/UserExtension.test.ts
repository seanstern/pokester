import { getMockReq, getMockRes } from "@jest-mock/express";
import User from "../../models/user/UserModel";
import { OIDCIdentifier } from "./OIDCIdentifierExtension";
import UserExtension from "./UserExtension";

const oidcIdentifier: OIDCIdentifier = {
  iss: "issuer",
  sub: "subject",
};

const user = new User();
const mockFindOneExec = jest.fn().mockResolvedValue(user);
const mockFindOne = jest.spyOn(User, "findOne").mockReturnValue({
  exec: mockFindOneExec,
} as any);

describe("extend", () => {
  test("succeeds with user present in DB", async () => {
    const req = getMockReq({ oidc: { idTokenClaims: oidcIdentifier } });
    const { res, next } = getMockRes();

    await UserExtension.extend(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockFindOne).toHaveBeenCalledWith({ oidc: oidcIdentifier });
    expect(mockFindOneExec).toHaveBeenCalledTimes(1);
    expect(mockFindOneExec).toHaveBeenCalledWith();
    expect(req.user).toBe(user);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test("succeeds with user present absent from DB", async () => {
    mockFindOneExec.mockResolvedValueOnce(null);

    const req = getMockReq({ oidc: { idTokenClaims: oidcIdentifier } });
    const { res, next } = getMockRes();

    await UserExtension.extend(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockFindOne).toHaveBeenCalledWith({ oidc: oidcIdentifier });
    expect(mockFindOneExec).toHaveBeenCalledTimes(1);
    expect(mockFindOneExec).toHaveBeenCalledWith();
    expect(req.user).toBe(null);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test("fails becaues of unexpected error", async () => {
    mockFindOne.mockImplementationOnce(() => {
      throw new Error("unexpected");
    });

    const req = getMockReq({ oidc: { idTokenClaims: oidcIdentifier } });
    const { res, next } = getMockRes();

    await UserExtension.extend(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe("get", () => {
  test("succeeds with user present in req", () => {
    const req = getMockReq({ user });

    expect(UserExtension.get(req)).toStrictEqual({ user });
  });

  test("succeeds with user null in req", () => {
    const req = getMockReq({ user: null });

    expect(UserExtension.get(req)).toStrictEqual({ user: null });
  });

  test("fails with user undefined in req", () => {
    const req = getMockReq();

    expect(() => UserExtension.get(req)).toThrowError();
  });
});
