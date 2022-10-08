import { PokerRooms, User } from "@pokester/common-api";
import { rest } from "msw";

export const validRoomIdForPatch = "validRoomIdForPatch";
export const postRoomsRes =
  PokerRooms.Create.Fixtures.ResBody.standard.create();
export const getUserRes = User.Get.Fixtures.ResBody.fullyRegistered.create();

export const simulateDelay = () => new Promise((res) => setTimeout(res, 15));

const handlers = [
  rest.post<
    PokerRooms.Create.ReqBody,
    Record<string, never>,
    PokerRooms.Create.ResBody
  >("/api/rooms", async (req, res, ctx) => {
    await simulateDelay();
    return res(ctx.status(201), ctx.json(postRoomsRes));
  }),
  rest.patch<PokerRooms.Act.ReqBody, { roomId: string }, undefined>(
    "/api/rooms/:roomId",
    async (req, res, ctx) => {
      await simulateDelay();
      return res(ctx.status(204));
    }
  ),
  rest.get<undefined, Record<string, never>, User.Get.ResBody>(
    "/api/user",
    async (req, res, ctx) => {
      await simulateDelay();
      return res(ctx.status(200), ctx.json(getUserRes));
    }
  ),
  rest.patch<undefined, Record<string, never>, undefined>(
    "/api/user",
    async (req, res, ctx) => {
      await simulateDelay();
      return res(ctx.status(204));
    }
  ),
];

export default handlers;
