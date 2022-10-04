import { RegistrationStep } from "@pokester/common-api/user/get";
import { RequestContext } from "express-openid-connect";
import { HydratedUserDoc } from "./models/user";

export { RegistrationStep };

export type OIDC = Pick<RequestContext, "idTokenClaims">;

export type RegistrationParam = {
  oidc: OIDC;
  user: HydratedUserDoc | null;
};
/**
 * Given registration information, returns an array of registration steps that
 * are incomplete. When no steps are incomplete returns undefined.
 *
 * @param rp registration information
 * @returns an array of registration steps that are incomplete; undefined
 *   when no steps are incomplete
 */
export const getIncompleteRegistrationSteps = ({
  oidc,
  user,
}: RegistrationParam): RegistrationStep[] | undefined => {
  const incompleteSteps: RegistrationStep[] = [];
  const { email, email_verified } = oidc.idTokenClaims || {};
  const isValidEmail = typeof email === "string" && !!email;
  const isEmailVerified = email_verified === true;
  if (!isValidEmail || !isEmailVerified) {
    incompleteSteps.push(RegistrationStep.EMAIL_VERIFICATION);
  }
  if (!user?.username) {
    incompleteSteps.push(RegistrationStep.USERNAME_SELECTION);
  }
  return incompleteSteps.length > 0 ? incompleteSteps : undefined;
};

export type CompleteRegistration = {
  user: HydratedUserDoc & { username: string };
  oidc: {
    idTokenClaims: { email_verified: true; email: string };
  };
};
/**
 * Given registration information, returns true if the registration is
 * complete (i.e. no incomplete registration steps); false otherwise.
 *
 * @param rp registration information
 * @returns true if the registration is complete (i.e. no incomplete
 *   registration steps); false otherwise.
 */
export const isRegistrationComplete = (
  rp: RegistrationParam
): rp is CompleteRegistration => !getIncompleteRegistrationSteps(rp);
