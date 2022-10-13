import { PokerRooms } from "@pokester/common-api";
import { rest, RestHandler } from "msw";
import { simulateDelay } from "../../__fixtures__/server";
import { path } from "./config";
import mapValues from "lodash/mapValues";

type UseGetFixture<T extends PokerRooms.Get.ResBody | string> = Readonly<{
  resBody: T;
  mswRestHandler: RestHandler;
}>;

const create200Fixture = <T extends PokerRooms.Get.ResBody>(
  resBody: T
): UseGetFixture<T> => ({
  resBody,
  mswRestHandler: rest.get(`${path}/:roomId`, async (req, res, ctx) => {
    await simulateDelay();
    return res(ctx.status(200), ctx.json(resBody));
  }),
});

export const success = mapValues(
  PokerRooms.Get.Fixtures.ResBody,
  ({ create, description }) => ({ ...create200Fixture(create()), description })
);

const serverErrorBody = "custom server error body message";
export const serverError: UseGetFixture<string> = {
  resBody: serverErrorBody,
  mswRestHandler: rest.get(`${path}/:roomId`, async (req, res, ctx) => {
    await simulateDelay();
    return res(ctx.status(500), ctx.body(serverErrorBody));
  }),
};
