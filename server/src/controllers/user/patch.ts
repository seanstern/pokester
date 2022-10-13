import { ReqBody } from "@pokester/common-api/user/patch";
import patchReqBodySchema from "@pokester/common-api/user/patch/reqBodySchema";
import { RequestHandler } from "express";
import OIDCIdentifierExtension from "../../middleware/request-extensions/OIDCIdentifierExtension";
import User from "../../models/user";

export { ReqBody };

export const badRequestMessage =
  "Request body must contain at least one property";

export const usernameTakenMessage = (username?: string) =>
  `"${username}" has already been taken.`;

export const usernameChangeMessage =
  "Usernames can't be changed after initial selection.";

/**
 * Given an optional username, returns a filter for updateOne that ensures that
 * a document with a pre-existing username cannot be changed.
 *
 * @param username an optional username
 * @returnsa a filter for updateOne that ensures that a document with a
 *   pre-exiting username cannot be changed.
 */
export const existingUsernameUnchangedFilter = (username?: string) => {
  if (!username) {
    return {};
  }
  return { $or: [{ username: { $exists: false } }, { username }] };
};

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

    try {
      await User.updateOne(
        {
          oidc,
          ...existingUsernameUnchangedFilter(body.username),
        },
        body,
        { upsert: true }
      );
    } catch (err: any) {
      if (
        err.code === 11000 &&
        err.keyPattern?.username === 1 &&
        body.username
      ) {
        res.status(400).send(usernameTakenMessage(body.username));
        return;
      }
      if (
        err.code === 11000 &&
        err.keyPattern["oidc.iss"] === 1 &&
        err.keyPattern["oidc.sub"] === 1
      ) {
        res.status(400).send(usernameChangeMessage);
        return;
      }
      throw err;
    }
    res.status(204).send();
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export default patch;
