import { RequestHandler } from "express";
import request from "supertest";
import OIDCIdentifierExtension from "../middleware/request-extensions/OIDCIdentifierExtension";
import UserExtension from "../middleware/request-extensions/UserExtension";
import verifyAllowedUser from "../middleware/verifyAllowedUser";
import APIRouter from "./APIRouter";
import PokerRoomsRouter from "./PokerRoomsRouter";
import UserRouter from "./UserRouter";

jest.mock("../middleware/request-extensions/OIDCIdentifierExtension");
jest.mock("../middleware/verifyAllowedUser");
jest.mock("../middleware/request-extensions/UserExtension");
jest.mock("./PokerRoomsRouter");
jest.mock("./UserRouter");

const emptyNextHandler: RequestHandler = (req, res, next) => next();

jest
  .mocked(OIDCIdentifierExtension)
  .extend.mockImplementation(emptyNextHandler);
jest.mocked(verifyAllowedUser).mockImplementation(emptyNextHandler);
jest.mocked(UserExtension).extend.mockImplementation(emptyNextHandler);

const emptyResponseHandler: RequestHandler = (req, res) => res.end();

jest.mocked(PokerRoomsRouter).mockImplementation(emptyResponseHandler);
jest.mocked(UserRouter).mockImplementation(emptyResponseHandler);

test("'/rooms' route uses PokerRoomsRouter", async () => {
  await request(APIRouter).get("/rooms");
  expect(PokerRoomsRouter).toHaveBeenCalledTimes(1);
  expect(UserExtension.extend).toHaveBeenCalledTimes(1);
  expect(verifyAllowedUser).toHaveBeenCalledTimes(1);
  expect(OIDCIdentifierExtension.extend).toHaveBeenCalledTimes(1);
});

test("'/user' route uses PokerRoomsRouter", async () => {
  await request(APIRouter).get("/user");
  expect(UserRouter).toHaveBeenCalledTimes(1);
  expect(UserExtension.extend).toHaveBeenCalledTimes(1);
  expect(verifyAllowedUser).toHaveBeenCalledTimes(1);
  expect(OIDCIdentifierExtension.extend).toHaveBeenCalledTimes(1);
});
