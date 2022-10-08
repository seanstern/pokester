import { getMockReq, getMockRes } from "@jest-mock/express";
import OIDCIdentifierExtension from "../../middleware/request-extensions/OIDCIdentifierExtension";
import User from "../../models/user";
import patch, {
  badRequestMessage,
  existingUsernameUnchangedFilter,
  ReqBody,
  usernameChangeMessage,
  usernameTakenMessage,
} from "./patch";

const mockOIDCIdentifier = { iss: "issuer", sub: "subject" };
jest.spyOn(OIDCIdentifierExtension, "get").mockReturnValue(mockOIDCIdentifier);

const mockUpdateOne = jest
  .spyOn(User, "updateOne")
  .mockResolvedValue({} as any);

test("succeeds with username field in request body", async () => {
  const body: ReqBody = { username: "foo" };
  const req = getMockReq<Parameters<typeof patch>[0]>({ body });
  const { res, next } = getMockRes<Parameters<typeof patch>[1]>();

  await patch(req, res, next);

  expect(next).not.toHaveBeenCalled();

  expect(mockUpdateOne).toHaveBeenCalledTimes(1);
  expect(mockUpdateOne).toHaveBeenCalledWith(
    {
      oidc: mockOIDCIdentifier,
      ...existingUsernameUnchangedFilter(body.username),
    },
    body,
    { upsert: true }
  );
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(204);
  expect(res.send).toHaveBeenCalledTimes(1);
  expect(res.send).toHaveBeenCalledWith();
});

describe("fails", () => {
  test("with no reuqest body", async () => {
    const body: ReqBody = {};
    const req = getMockReq<Parameters<typeof patch>[0]>({ body });
    const { res, next } = getMockRes<Parameters<typeof patch>[1]>();

    await patch(req, res, next);

    expect(mockUpdateOne).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(badRequestMessage);
  });

  test("with username that doesn't match pre-existing username in document", async () => {
    const body: ReqBody = { username: "doesntmatch" };
    const req = getMockReq<Parameters<typeof patch>[0]>({ body });
    const { res, next } = getMockRes<Parameters<typeof patch>[1]>();

    mockUpdateOne.mockRejectedValueOnce({
      code: 11000,
      keyPattern: { "oidc.iss": 1, "oidc.sub": 1 },
    });

    await patch(req, res, next);

    expect(next).not.toHaveBeenCalled();

    expect(mockUpdateOne).toHaveBeenCalledTimes(1);
    expect(mockUpdateOne).toHaveBeenCalledWith(
      {
        oidc: mockOIDCIdentifier,
        ...existingUsernameUnchangedFilter(body.username),
      },
      body,
      { upsert: true }
    );
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(usernameChangeMessage);
  });

  test("with username that isn't unique", async () => {
    const body: ReqBody = { username: "matchesanotheruser" };
    const req = getMockReq<Parameters<typeof patch>[0]>({ body });
    const { res, next } = getMockRes<Parameters<typeof patch>[1]>();

    mockUpdateOne.mockRejectedValueOnce({
      code: 11000,
      keyPattern: { username: 1 },
    });

    await patch(req, res, next);

    expect(next).not.toHaveBeenCalled();

    expect(mockUpdateOne).toHaveBeenCalledTimes(1);
    expect(mockUpdateOne).toHaveBeenCalledWith(
      {
        oidc: mockOIDCIdentifier,
        ...existingUsernameUnchangedFilter(body.username),
      },
      body,
      { upsert: true }
    );
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(usernameTakenMessage(body.username));
  });
});
