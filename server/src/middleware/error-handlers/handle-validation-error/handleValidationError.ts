import { ValidationError } from "yup";
import { ErrorRequestHandler } from "express";

/**
 * Given a ValidationError, returns all errors combined into single string.
 *
 * @param err a ValidationError
 * @returns all in {@linkcode err} as a single string
 */
export const getSendBody = (err: ValidationError) => err.errors.join("\n");

/**
 * Given an error, an HTTP request, an HTTP response, and a callback, attempts
 * to ensure handle ValidationErrors. Responds with status of 400 and a string
 * when a ValidationError is passed; calls the callback with error information
 * otherwise.
 *
 * @param err an error
 * @param req an HTTP request
 * @param res an HTTP response
 * @param next the callback
 */
const handleReqBodyValidationError: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  if (ValidationError.isError(err)) {
    return res.status(400).send(err.errors.join("\n"));
  }
  return next(err);
};

export default handleReqBodyValidationError;
