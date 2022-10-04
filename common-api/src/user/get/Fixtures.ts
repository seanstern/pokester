import { Fixture } from "@pokester/poker-engine-fixtures";
import { RegistrationStep, ResBody as ResBodyType } from "./Types";

const fullyRegistered: Fixture<ResBodyType> = {
  description: "Fully registered user",
  create: () => ({
    email: {
      address: "someuser@example.com",
      verified: true,
    },
    username: "someuser",
  }),
};

const unregisteredNoUsername: Fixture<ResBodyType> = {
  description: "Unregistered user missing username",
  create: () => ({
    email: {
      address: "someuser@example.com",
      verified: true,
    },
    incompleteRegistration: [RegistrationStep.USERNAME_SELECTION],
  }),
};

const unregisteredUnverifiedEmail: Fixture<ResBodyType> = {
  description: "Unregistered user with unverified email",
  create: () => ({
    email: {
      address: "someuser@example.com",
      verified: false,
    },
    username: "someuser",
    incompleteRegistration: [RegistrationStep.EMAIL_VERIFICATION],
  }),
};

const unregisteredNoUsernameUnverifiedEmail: Fixture<ResBodyType> = {
  description: "Unregistered user with unverified email",
  create: () => ({
    email: {
      address: "someuser@example.com",
      verified: false,
    },
    incompleteRegistration: [
      RegistrationStep.EMAIL_VERIFICATION,
      RegistrationStep.USERNAME_SELECTION,
    ],
  }),
};

export const ResBody = {
  fullyRegistered,
  unregisteredNoUsername,
  unregisteredUnverifiedEmail,
  unregisteredNoUsernameUnverifiedEmail,
};
