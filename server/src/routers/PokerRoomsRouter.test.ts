import PokerRoomsRouter from "./PokerRoomsRouter";
import { create, get, act, getAll } from "../controllers/PokerRoomsController";
import request from "supertest";

jest.mock("../controllers/PokerRoomsController");

describe("'/' route", () => {
  test("via POST calls PokerRoomsController.create", async () => {
    await request(PokerRoomsRouter).post("/");
    expect(create).toHaveBeenCalledTimes(1);
  });

  test("via GET calls PokerRoomsController.getAll", async () => {
    await request(PokerRoomsRouter).get("/");
    expect(getAll).toHaveBeenCalledTimes(1);
  });
});

describe("'/:roomId' route", () => {
  test("via GET calls PokerRoomsController.get", async () => {
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
  });

  test("via PATCH calls PokerRoomsController.act", async () => {
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
  });
});
