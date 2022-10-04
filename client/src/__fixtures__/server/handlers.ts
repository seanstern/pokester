import { PokerRooms, User } from "@pokester/common-api";
import { rest } from "msw";

export const validRoomIdForPatch = "validRoomIdForPatch";

const handlers = [
  rest.post<
    PokerRooms.Create.ReqBody,
    Record<string, never>,
    PokerRooms.Create.ResBody
  >("/api/rooms", (req, res, ctx) =>
    res(
      ctx.status(201),
      ctx.json(PokerRooms.Create.Fixtures.ResBody.standard.create())
    )
  ),
  rest.patch<PokerRooms.Act.ReqBody, { roomId: string }, undefined>(
    "/api/rooms/:roomId",
    (req, res, ctx) => {
      const { roomId } = req.params;
      if (roomId !== validRoomIdForPatch) {
        return res(ctx.status(404));
      }
      return res(ctx.status(204));
    }
  ),
  rest.get<undefined, Record<string, never>, User.Get.ResBody>(
    "/api/user",
    (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json(User.Get.Fixtures.ResBody.fullyRegistered.create())
      )
  ),
];

export default handlers;
