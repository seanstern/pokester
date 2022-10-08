import { AxiosError } from "axios";

/**
 * Given an optional, nullable error, returns the string body of bad request
 * errors (i.e. 400 errosr); when the error is not a 400 with a string body,
 * returns undefined.
 *
 * @param error optional, nullable error that may be a 400 with a string
 *   body
 * @returns the string body of a 400 error; undefined otherwise
 */
const getBadRequestErrorMessage = (error?: AxiosError<string> | null) =>
  error?.response?.status === 400 && typeof error?.response?.data === "string"
    ? error?.response?.data
    : undefined;

export default getBadRequestErrorMessage;
