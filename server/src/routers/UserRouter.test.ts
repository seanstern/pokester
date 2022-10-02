import { RequestHandler } from "express";
import request from "supertest";
import { get, patch } from "../controllers/user";
import UserRouter from "./UserRouter";

jest.mock("../controllers/user");

const emptyResponseHandler: RequestHandler = (req, res) => res.end();

describe("'/' route", () => {
  test("via GET calls get", async () => {
    jest.mocked(get).mockImplementation(emptyResponseHandler);

    await request(UserRouter).get("/");

    expect(get).toHaveBeenCalledTimes(1);
  });

  test("via PATCH calls patch", async () => {
    jest.mocked(patch).mockImplementation(emptyResponseHandler);

    await request(UserRouter).patch("/");

    expect(patch).toHaveBeenCalledTimes(1);
  });
});
