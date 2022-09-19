import { PokerRooms } from "@pokester/common-api";
import { rest } from "msw";

export const validRoomIdForPatch = "validRoomIdForPatch";

const handlers = [
  rest.post<PokerRooms.Create.ReqBody, never, PokerRooms.Create.ResBody>(
    "/api/rooms",
    async (req, res, ctx) => {
      return res(
        ctx.status(201),
        ctx.json(PokerRooms.Create.Fixtures.ResBody.standard.create())
      );
    }
  ),
  rest.patch<PokerRooms.Act.ReqBody, { roomId: string }, undefined>(
    "api/rooms/:roomId",
    async (req, res, ctx) => {
      const { roomId } = req.params;
      if (roomId !== validRoomIdForPatch) {
        return res(ctx.status(404));
      }
      return res(ctx.status(204));
    }
  ),
];

export default handlers;
