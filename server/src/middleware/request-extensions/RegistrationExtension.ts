import {
  CompleteRegistration,
  isRegistrationComplete,
} from "../../Registraton";
import RequestExtension from "./RequestExtension";
import UserExtension from "./UserExtension";

export { CompleteRegistration };

type RegistrationExtension = RequestExtension<CompleteRegistration>;

export const incompleteRegistration = "Incomplete registraton";

/**
 * Given an HTTP request, an HTTP response, and a callback, attempts to ensure
 * the request contains sufficient information to return the
 * {@linkcode CompleteRegistration} contained therein. Calls the callback with
 * no errors upon success; responses with status of 403 and a string when
 * registration is icomplete; calls the callback with error information upon
 * other failure.
 *
 * @param req an HTTP request
 * @param res an HTTP response
 * @param next the callback
 */
const extend: RegistrationExtension["extend"] = (req, res, next) => {
  try {
    const { user } = UserExtension.get(req);
    const registration = { oidc: req.oidc, user };
    if (!isRegistrationComplete(registration)) {
      res.status(403).send(incompleteRegistration);
      return;
    }
    next();
    return;
  } catch (err) {
    next(err);
    return;
  }
};

/**
 * Given a request that has been extend by {@linkcode extend}, returns the
 * {@linkcode CompleteRegistration} component of the request.
 *
 * @param req the request
 * @returns  the {@linkcode CompleteRegistration} component of the request.
 */
const get: RegistrationExtension["get"] = (req) => {
  const { user } = UserExtension.get(req);
  const registration = { oidc: req.oidc, user };
  if (!isRegistrationComplete(registration)) {
    throw new Error("Complete registration missing from request");
  }
  return registration;
};

export default { get, extend } as RegistrationExtension;
