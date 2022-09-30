import OIDCIdentifierExtension, {
  OIDCIdentifier,
} from "./OIDCIdentifierExtension";
import { getMockReq, getMockRes } from "@jest-mock/express";

const oidcIdentifier: OIDCIdentifier = {
  iss: "issuer",
  sub: "subject",
};

const invalidOIDCIdentifier = { sub: "subject" };

describe("extend", () => {
  test("succeeds", () => {
    const req = getMockReq({
      oidc: { idTokenClaims: oidcIdentifier },
    });
    const { res, next } = getMockRes();

    OIDCIdentifierExtension.extend(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test("fails", () => {
    const req = getMockReq({
      oidc: { idTokenClaims: invalidOIDCIdentifier },
    });
    const { res, next } = getMockRes();

    OIDCIdentifierExtension.extend(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe("get", () => {
  test("succeeds", () => {
    const req = getMockReq({
      oidc: { idTokenClaims: oidcIdentifier },
    });

    expect(OIDCIdentifierExtension.get(req)).toStrictEqual(oidcIdentifier);
  });

  test("fails", () => {
    const req = getMockReq({
      oidc: { idTokenClaims: invalidOIDCIdentifier },
    });

    expect(() => OIDCIdentifierExtension.get(req)).toThrowError();
  });
});
