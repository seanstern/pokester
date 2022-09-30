import { getMockReq, getMockRes } from "@jest-mock/express";
import OIDCIdentifierExtension from "../../middleware/request-extensions/OIDCIdentifierExtension";
import patch, { ReqBody, badRequestMessage } from "./patch";
import User from "../../models/user";

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
    { oidc: mockOIDCIdentifier },
    body,
    { upsert: true }
  );
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(204);
  expect(res.send).toHaveBeenCalledTimes(1);
  expect(res.send).toHaveBeenCalledWith();
});

test("fails with no properties in request vale", async () => {
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
