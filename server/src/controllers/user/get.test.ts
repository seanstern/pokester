import { getMockReq, getMockRes } from "@jest-mock/express";
import UserExtension from "../../middleware/request-extensions/UserExtension";
import get, { resHeaders } from "./get";

const mockUserExtensionGet = jest
  .spyOn(UserExtension, "get")
  .mockReturnValue({ user: null });

describe("succeeds", () => {
  test("with no email and no user", async () => {
    const req = getMockReq<Parameters<typeof get>[0]>({ oidc: {} });
    const { res, next } = getMockRes<Parameters<typeof get>[1]>();

    await get(req, res, next);

    expect(next).not.toHaveBeenCalled();

    expect(res.set).toHaveBeenCalledTimes(1);
    expect(res.set).toHaveBeenCalledWith(resHeaders);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect((res.json as jest.Mock).mock.lastCall).toMatchInlineSnapshot(`
      Array [
        Object {
          "email": undefined,
          "incompleteRegistration": Array [
            "email verification",
            "username selection",
          ],
          "username": undefined,
        },
      ]
    `);
  });

  test("with unverified email and no user", async () => {
    const req = getMockReq<Parameters<typeof get>[0]>({
      oidc: { idTokenClaims: { email: "foo@bar.com" } },
    });
    const { res, next } = getMockRes<Parameters<typeof get>[1]>();

    await get(req, res, next);

    expect(next).not.toHaveBeenCalled();

    expect(res.set).toHaveBeenCalledTimes(1);
    expect(res.set).toHaveBeenCalledWith(resHeaders);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect((res.json as jest.Mock).mock.lastCall).toMatchInlineSnapshot(`
      Array [
        Object {
          "email": Object {
            "address": "foo@bar.com",
            "verified": false,
          },
          "incompleteRegistration": Array [
            "email verification",
            "username selection",
          ],
          "username": undefined,
        },
      ]
    `);
  });

  test("with verified email and no user", async () => {
    const req = getMockReq<Parameters<typeof get>[0]>({
      oidc: { idTokenClaims: { email: "foo@bar.com", email_verified: true } },
    });
    const { res, next } = getMockRes<Parameters<typeof get>[1]>();

    await get(req, res, next);

    expect(next).not.toHaveBeenCalled();

    expect(res.set).toHaveBeenCalledTimes(1);
    expect(res.set).toHaveBeenCalledWith(resHeaders);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect((res.json as jest.Mock).mock.lastCall).toMatchInlineSnapshot(`
      Array [
        Object {
          "email": Object {
            "address": "foo@bar.com",
            "verified": true,
          },
          "incompleteRegistration": Array [
            "username selection",
          ],
          "username": undefined,
        },
      ]
    `);
  });

  test("with verified email and user with no username", async () => {
    mockUserExtensionGet.mockReturnValueOnce({
      user: { username: undefined },
    } as any);

    const req = getMockReq<Parameters<typeof get>[0]>({
      oidc: { idTokenClaims: { email: "foo@bar.com", email_verified: true } },
    });
    const { res, next } = getMockRes<Parameters<typeof get>[1]>();

    await get(req, res, next);

    expect(next).not.toHaveBeenCalled();

    expect(res.set).toHaveBeenCalledTimes(1);
    expect(res.set).toHaveBeenCalledWith(resHeaders);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect((res.json as jest.Mock).mock.lastCall).toMatchInlineSnapshot(`
      Array [
        Object {
          "email": Object {
            "address": "foo@bar.com",
            "verified": true,
          },
          "incompleteRegistration": Array [
            "username selection",
          ],
          "username": undefined,
        },
      ]
    `);
  });

  test("with verified email and username", async () => {
    mockUserExtensionGet.mockReturnValueOnce({
      user: { username: "someusername" },
    } as any);

    const req = getMockReq<Parameters<typeof get>[0]>({
      oidc: { idTokenClaims: { email: "foo@bar.com", email_verified: true } },
    });
    const { res, next } = getMockRes<Parameters<typeof get>[1]>();

    await get(req, res, next);

    expect(next).not.toHaveBeenCalled();

    expect(res.set).toHaveBeenCalledTimes(1);
    expect(res.set).toHaveBeenCalledWith(resHeaders);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect((res.json as jest.Mock).mock.lastCall).toMatchInlineSnapshot(`
      Array [
        Object {
          "email": Object {
            "address": "foo@bar.com",
            "verified": true,
          },
          "incompleteRegistration": undefined,
          "username": "someusername",
        },
      ]
    `);
  });

  test("with unverified email and username", async () => {
    mockUserExtensionGet.mockReturnValueOnce({
      user: { username: "someusername" },
    } as any);

    const req = getMockReq<Parameters<typeof get>[0]>({
      oidc: { idTokenClaims: { email: "foo@bar.com" } },
    });
    const { res, next } = getMockRes<Parameters<typeof get>[1]>();

    await get(req, res, next);

    expect(next).not.toHaveBeenCalled();

    expect(res.set).toHaveBeenCalledTimes(1);
    expect(res.set).toHaveBeenCalledWith(resHeaders);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect((res.json as jest.Mock).mock.lastCall).toMatchInlineSnapshot(`
      Array [
        Object {
          "email": Object {
            "address": "foo@bar.com",
            "verified": false,
          },
          "incompleteRegistration": Array [
            "email verification",
          ],
          "username": "someusername",
        },
      ]
    `);
  });
});
