import { RequestHandler, Response } from "express";
import AllowedUser from "../models/allowed-user/index";

export const notAllowed = "User not allowed";

const sendNotAllowed = (res: Response) => res.status(403).send(notAllowed);

/**
 * Given an HTTP request, an HTTP response, and a callback, attempts to ensure
 * the request contains an id token with the email of an allowed user.
 * Calls the callback with no errors upon success; responds with status of 403
 * and a string when email does not match anllowed user; calls the callback with
 * error information upon failure.
 *
 * @param req an HTTP request
 * @param res an HTTP response
 * @param next the callback
 */
const verifyAllowedUser: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.oidc.idTokenClaims || {};
    if (typeof email !== "string") {
      return sendNotAllowed(res);
    }
    const allowedUser = await AllowedUser.findOne({ email }).exec();
    if (!allowedUser) {
      return sendNotAllowed(res);
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

export default verifyAllowedUser;
