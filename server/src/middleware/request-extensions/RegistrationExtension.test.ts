import { getMockReq, getMockRes } from "@jest-mock/express";
import User from "../../models/user/UserModel";
import UserExtension from "./UserExtension";
import RegistrationExtension, {
  CompleteRegistration,
  incompleteRegistration,
} from "./RegistrationExtension";

const username = "someusername";
const user = new User({ username });
const mockUserExtensionGet = jest
  .spyOn(UserExtension, "get")
  .mockReturnValue({ user });

const completeOIDC: CompleteRegistration["oidc"] = {
  idTokenClaims: { email: "foo@bar.com", email_verified: true },
};

describe("extend", () => {
  test("succeeds", () => {
    const req = getMockReq({ oidc: completeOIDC });
    const { res, next } = getMockRes();

    RegistrationExtension.extend(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test("fails becaues of incomplete registration", () => {
    mockUserExtensionGet.mockReturnValueOnce({ user: null });

    const req = getMockReq({ oidc: completeOIDC });
    const { res, next } = getMockRes();

    RegistrationExtension.extend(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(incompleteRegistration);
  });

  test("fails because of unexpected error", () => {
    mockUserExtensionGet.mockImplementationOnce(() => {
      throw new Error("unexpected");
    });

    const req = getMockReq({ oidc: completeOIDC });
    const { res, next } = getMockRes();

    RegistrationExtension.extend(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe("get", () => {
  test("succeeds", () => {
    const req = getMockReq({ oidc: completeOIDC });

    expect(RegistrationExtension.get(req)).toStrictEqual({
      user,
      oidc: completeOIDC,
    });
  });

  test("fails", () => {
    mockUserExtensionGet.mockReturnValueOnce({ user: null });

    const req = getMockReq({ oidc: completeOIDC });

    expect(() => RegistrationExtension.get(req)).toThrowError();
  });
});
