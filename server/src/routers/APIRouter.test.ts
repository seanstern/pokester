import APIRouter from "./APIRouter";
import PokerRoomsRouter from "./PokerRoomsRouter";
import request from "supertest";

jest.mock("./PokerRoomsRouter", () =>
  jest.fn((req: any, res: any) => res.end())
);

test("'/' route uses PokerRoomsRouter", async () => {
  await request(APIRouter).get("/rooms");
  expect(PokerRoomsRouter).toHaveBeenCalledTimes(1);
  APIRouter.
});
