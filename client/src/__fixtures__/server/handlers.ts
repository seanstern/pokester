import { rest, PathParams } from "msw";
import { Routes } from "@pokester/common-api";

const roomId = "62ccf81d289c60d0176a7bc3";

const handlers = [
  rest.post<
    Routes.PokerRooms.Create.ReqBody,
    PathParams<string>,
    Routes.PokerRooms.Create.ResBody
  >("/api/rooms", async (req, res, ctx) => {
    return res(ctx.status(201), ctx.json(roomId));
  }),
];

export default handlers;
