import User, { HydratedUserDoc } from "../../models/user/index";
import RequestExtension from "./RequestExtension";
import OIDCIdentifierExtension from "./OIDCIdentifierExtension";

export type UserExtensionProps = { user: HydratedUserDoc | null };

type UserExtension = RequestExtension<UserExtensionProps>;

/**
 * Given an HTTP request, an HTTP response, and a callback, attempts to ensure
 * the request contains sufficient information to return the
 * {@linkcode UserExtensionProps} contained therein. Calls the callback with
 * no errors upon success; calls the callback with error information upon
 * other failure.
 *
 * @param req an HTTP request
 * @param res an HTTP response
 * @param next the callback
 */
const extend: UserExtension["extend"] = async (req, res, next) => {
  try {
    const oidc = OIDCIdentifierExtension.get(req);
    req.user = await User.findOne({ oidc }).exec();
    return next();
  } catch (err) {
    return next(err);
  }
};

/**
 * Given a request that has been extend by {@linkcode extend}, returns the
 * {@linkcode UserExtensionProps} component of the request.
 *
 * @param req the request
 * @returns  the {@linkcode UserExtensionProps} component of the request.
 */
const get: UserExtension["get"] = (req) => {
  if (req.user === undefined) {
    throw new Error("User extension missing from request");
  }
  return { user: req.user };
};

export default { get, extend } as UserExtension;
