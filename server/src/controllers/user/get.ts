import { ResBody } from "@pokester/common-api/user/get";
import { RequestHandler } from "express";
import UserExtension from "../../middleware/request-extensions/UserExtension";
import { getIncompleteRegistrationSteps } from "../../Registraton";

export const resHeaders: Readonly<Record<string, string>> = {
  // This endpoint is used to check auth status, so caching result
  // can lead browser to misinterpret auth status.
  "Cache-Control": "no-store",
};

/**
 * Given an HTTP request to get a User, an HTTP response, and a
 * callback, attempts to respond with a JSON representation of the
 * User. Responds with a status of 200 and JSON representation of
 * the User when successful; calls the callback with error information
 * upon other failure.
 * @param req  an HTTP request
 * @param res the HTTP response
 * @param next the callback
 */
const get: RequestHandler<Record<string, never>, ResBody | string> = (
  req,
  res,
  next
) => {
  try {
    const { user } = UserExtension.get(req);
    const { email, email_verified } = req.oidc.idTokenClaims || {};

    const address = typeof email === "string" && !!email ? email : undefined;
    const verified = email_verified === true ? (email_verified as true) : false;

    const incompleteRegistration = getIncompleteRegistrationSteps({
      oidc: req.oidc,
      user,
    });

    res
      .set(resHeaders)
      .status(200)
      .json({
        username: user?.username,
        email: address ? { address, verified } : undefined,
        incompleteRegistration,
      });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export default get;
