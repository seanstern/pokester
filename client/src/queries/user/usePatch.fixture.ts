import { rest, RestHandler } from "msw";
import { simulateDelay } from "../../__fixtures__/server";
import { path } from "./config";

type UsePatchFixture = Readonly<{
  resBody: string;
  mswRestHandler: RestHandler;
}>;

const badRequestBody = "custom bad request body message";
export const badRequest: UsePatchFixture = {
  resBody: badRequestBody,
  mswRestHandler: rest.patch(path, async (req, res, ctx) => {
    await simulateDelay();
    return res(ctx.status(400), ctx.body(badRequestBody));
  }),
};
