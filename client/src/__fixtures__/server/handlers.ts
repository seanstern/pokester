import { PokerRooms } from "@pokester/common-api";
import { PathParams, rest } from "msw";

const handlers = [
  rest.post<
    PokerRooms.Create.ReqBody,
    PathParams<string>,
    PokerRooms.Create.ResBody
  >("/api/rooms", async (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json(PokerRooms.Create.Fixtures.ResBody.standard.create())
    );
  }),
];

export default handlers;
