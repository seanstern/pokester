import { User } from "@pokester/common-api";
import { rest, RestHandler } from "msw";
import { simulateDelay } from "../../__fixtures__/server";
import { path } from "./config";

type UseGetFixture<T extends User.Get.ResBody | string> = Readonly<{
  resBody: T;
  mswRestHandler: RestHandler;
}>;

const serverErrorBody = "custom server error body message";
export const serverError: UseGetFixture<string> = {
  resBody: serverErrorBody,
  mswRestHandler: rest.get(path, async (req, res, ctx) => {
    await simulateDelay();
    return res(ctx.status(500), ctx.body(serverErrorBody));
  }),
};

const create200Fixture = <T extends User.Get.ResBody>(
  resBody: T
): UseGetFixture<T> => ({
  resBody,
  mswRestHandler: rest.get(path, async (req, res, ctx) => {
    await simulateDelay();
    return res(ctx.status(200), ctx.json(resBody));
  }),
});

const diffUsername = "diffusername";

export const fullyRegistered = create200Fixture(
  User.Get.Fixtures.ResBody.fullyRegistered.create()
);

export const fullyRegisteredDiffUsername = create200Fixture({
  ...User.Get.Fixtures.ResBody.fullyRegistered.create(),
  username: diffUsername,
});

export const unregisteredNoUsername = create200Fixture(
  User.Get.Fixtures.ResBody.unregisteredNoUsername.create()
);

export const unregisteredNoUsernameUnverifiedEmail = create200Fixture(
  User.Get.Fixtures.ResBody.unregisteredNoUsernameUnverifiedEmail.create()
);

export const unregisteredUnverifiedEmail = create200Fixture(
  User.Get.Fixtures.ResBody.unregisteredUnverifiedEmail.create()
);

export const unregisteredUnverifiedEmailDiffUsername = create200Fixture({
  ...User.Get.Fixtures.ResBody.unregisteredUnverifiedEmail.create(),
  username: diffUsername,
});
