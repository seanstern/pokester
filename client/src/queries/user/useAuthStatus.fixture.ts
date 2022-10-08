import { User } from "@pokester/common-api";
import { rest, RestHandler } from "msw";
import { simulateDelay } from "../../__fixtures__/server";
import { path } from "./config";
import { AuthStatus, AuthStatusQuery } from "./useAuthStatus";

type UseAuthStatusFixture = Readonly<{
  query: AuthStatusQuery;
  mswRestHandler: RestHandler;
}>;

export const pending: UseAuthStatusFixture = {
  query: { pending: true },
  mswRestHandler: rest.get(path, (req, res, ctx) => {
    return new Promise((res) => {});
  }),
};

export const error: UseAuthStatusFixture = {
  query: {
    pending: false,
    error: new Error("Request failed with status code 500"),
  },
  mswRestHandler: rest.get(path, async (req, res, ctx) => {
    await simulateDelay();
    return res(ctx.status(500));
  }),
};

export const unauthenticated: UseAuthStatusFixture = {
  query: {
    pending: false,
    data: AuthStatus.UNAUTHENTICATED,
  },
  mswRestHandler: rest.get(path, async (req, res, ctx) => {
    await simulateDelay();
    return res(ctx.status(401));
  }),
};

export const authenticated: UseAuthStatusFixture = {
  query: {
    pending: false,
    data: AuthStatus.AUTHENTICATED,
  },
  mswRestHandler: rest.get(path, async (req, res, ctx) => {
    await simulateDelay();
    return res(ctx.status(403));
  }),
};

export const authorized: UseAuthStatusFixture = {
  query: {
    pending: false,
    data: AuthStatus.AUTHORIZED,
  },
  mswRestHandler: rest.get(path, async (req, res, ctx) => {
    await simulateDelay();
    return res(
      ctx.status(200),
      ctx.json(
        User.Get.Fixtures.ResBody.unregisteredNoUsernameUnverifiedEmail.create()
      )
    );
  }),
};

export const registered: UseAuthStatusFixture = {
  query: {
    pending: false,
    data: AuthStatus.REGISTERED,
  },
  mswRestHandler: rest.get(path, async (req, res, ctx) => {
    await simulateDelay();
    return res(
      ctx.status(200),
      ctx.json(User.Get.Fixtures.ResBody.fullyRegistered.create())
    );
  }),
};
