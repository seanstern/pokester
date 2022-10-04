import {
  OIDC,
  RegistrationParam,
  RegistrationStep,
  isRegistrationComplete,
  getIncompleteRegistrationSteps,
} from "./Registraton";
import User from "./models/user";

const userWithoutUsername = new User();
const userWithUsername = new User({ username: "someusername" });
const oidcNoEmail: OIDC = { idTokenClaims: { email_verified: true } };
const oidcNoEmailVerified: OIDC = { idTokenClaims: { email: "foo@bar.com" } };
const oidcEmailNotVerified: OIDC = {
  idTokenClaims: { email: "foo@bar.com", email_verified: false },
};
const oidcEmailVerified: OIDC = {
  idTokenClaims: { email: "foo@bar.com", email_verified: true },
};

const registrationCases: [
  string,
  ReturnType<typeof getIncompleteRegistrationSteps>,
  RegistrationParam
][] = [
  [
    "incomplete registration because no email",
    [RegistrationStep.EMAIL_VERIFICATION],
    { user: userWithUsername, oidc: oidcNoEmail },
  ],
  [
    "no email_verified",
    [RegistrationStep.EMAIL_VERIFICATION],
    { user: userWithUsername, oidc: oidcNoEmailVerified },
  ],
  [
    "email not verified",
    [RegistrationStep.EMAIL_VERIFICATION],
    { user: userWithUsername, oidc: oidcEmailNotVerified },
  ],
  [
    "no user",
    [RegistrationStep.USERNAME_SELECTION],
    { user: null, oidc: oidcEmailVerified },
  ],
  [
    "no username",
    [RegistrationStep.USERNAME_SELECTION],
    { user: userWithoutUsername, oidc: oidcEmailVerified },
  ],
  [
    "no username, email not verified",
    [RegistrationStep.EMAIL_VERIFICATION, RegistrationStep.USERNAME_SELECTION],
    { user: userWithoutUsername, oidc: oidcEmailNotVerified },
  ],
  [
    "username, verified email",
    undefined,
    { user: userWithUsername, oidc: oidcEmailVerified },
  ],
];

describe("getIncompleteRegistrationSteps", () => {
  test.each(registrationCases)(
    "invoked with %s returns %j",
    (_, expected, rp) =>
      expect(getIncompleteRegistrationSteps(rp)).toStrictEqual(expected)
  );
});

const isCompleteCases: [string, boolean, RegistrationParam][] =
  registrationCases.map(([description, incompleteSteps, rp]) => [
    description,
    !incompleteSteps,
    rp,
  ]);

describe("isRegistrationComplete", () => {
  test.each(isCompleteCases)("invoked with %s returns %j", (_, expected, rp) =>
    expect(isRegistrationComplete(rp)).toBe(expected)
  );
});
