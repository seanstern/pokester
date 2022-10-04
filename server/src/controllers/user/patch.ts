import { ReqBody } from "@pokester/common-api/user/patch";
import patchReqBodySchema from "@pokester/common-api/user/patch/reqBodySchema";
import { RequestHandler } from "express";
import OIDCIdentifierExtension from "../../middleware/request-extensions/OIDCIdentifierExtension";
import User from "../../models/user";

export { ReqBody };

export const badRequestMessage =
  "Request body must contain at least one property";

/**
 * Given an HTTP request to patch a User, an HTTP response, and a callback,
 * attempts to patch the User. Responds with a status of 204 patch is
 * successful; calls the callback with error information upon other failure.
 * @param req  an HTTP request
 * @param req.body the patch; a well specified body will be of
 *   {@linkcode ReqBody} type with at least one property specified
 * @param res the HTTP response
 * @param next the callback
 */
const patch: RequestHandler<Record<string, never>, string, ReqBody> = async (
  req,
  res,
  next
) => {
  try {
    const oidc = OIDCIdentifierExtension.get(req);
    const body = patchReqBodySchema.validateSync(req.body, {
      stripUnknown: true,
    });

    if (Object.keys(body).length === 0) {
      res.status(400).send(badRequestMessage);
      return;
    }

    await User.updateOne({ oidc }, body, { upsert: true });

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

export default patch;
