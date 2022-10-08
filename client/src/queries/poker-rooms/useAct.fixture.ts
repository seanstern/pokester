import { rest } from "msw";
import { simulateDelay } from "../../__fixtures__/server";
import { path } from "./config";

export const serverError = rest.patch(
  `${path}/:roomId`,
  async (req, res, ctx) => {
    await simulateDelay();
    return res(ctx.status(500));
  }
);
