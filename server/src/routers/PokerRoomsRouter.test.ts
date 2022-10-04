import { RequestHandler } from "express";
import request from "supertest";
import { act, create, get, getAll } from "../controllers/poker-rooms";
import RegistrationExtension from "../middleware/request-extensions/RegistrationExtension";
import PokerRoomsRouter from "./PokerRoomsRouter";

jest.mock("../controllers/poker-rooms");
jest.mock("../middleware/request-extensions/RegistrationExtension");

const emptyResponseHandler: RequestHandler = (req, res) => res.end();
const emptyNextHandler: RequestHandler = (req, res, next) => next();

jest.mocked(RegistrationExtension).extend.mockImplementation(emptyNextHandler);

describe("'/' route", () => {
  test("via POST calls create", async () => {
    jest.mocked(create).mockImplementation(emptyResponseHandler);

    await request(PokerRoomsRouter).post("/");

    expect(create).toHaveBeenCalledTimes(1);
    expect(RegistrationExtension.extend).toHaveBeenCalledTimes(1);
  });

  test("via GET calls getAll", async () => {
    jest.mocked(getAll).mockImplementation(emptyResponseHandler);

    await request(PokerRoomsRouter).get("/");

    expect(getAll).toHaveBeenCalledTimes(1);
    expect(RegistrationExtension.extend).toHaveBeenCalledTimes(1);
  });
});

describe("'/:roomId' route", () => {
  test("via GET calls get", async () => {
    jest.mocked(get).mockImplementation(emptyResponseHandler);

    const roomId = "someRoomId";
    await request(PokerRoomsRouter).get(`/${roomId}`);

    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenLastCalledWith(
      expect.objectContaining({
        params: { roomId },
      }),
      expect.anything(),
      expect.anything()
    );
    expect(RegistrationExtension.extend).toHaveBeenCalledTimes(1);
  });

  test("via PATCH calls act", async () => {
    jest.mocked(act).mockImplementation(emptyResponseHandler);

    const roomId = "someRoomId";
    await request(PokerRoomsRouter).patch(`/${roomId}`);

    expect(act).toHaveBeenCalledTimes(1);
    expect(act).toHaveBeenLastCalledWith(
      expect.objectContaining({
        params: { roomId },
      }),
      expect.anything(),
      expect.anything()
    );
    expect(RegistrationExtension.extend).toHaveBeenCalledTimes(1);
  });
});
