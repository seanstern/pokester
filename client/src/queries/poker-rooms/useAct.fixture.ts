import { rest, RestHandler } from "msw";
import { simulateDelay } from "../../__fixtures__/server";
import { path } from "./config";

type UseActFixture = Readonly<{
  resBody: string;
  mswRestHandler: RestHandler;
}>;

const badRequestBody = "custom bad request body message";
export const badRequest: UseActFixture = {
  resBody: badRequestBody,
  mswRestHandler: rest.patch(`${path}/:roomId`, async (req, res, ctx) => {
    await simulateDelay();
    return res(ctx.status(400), ctx.body(badRequestBody));
  }),
};
