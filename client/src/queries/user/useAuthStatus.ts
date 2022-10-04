import { User } from "@pokester/common-api";
import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";
import { path, queryKey } from "./config";

export enum AuthStatus {
  UNAUTHENTICATED = "unauthenticated",
  AUTHENTICATED = "authenticated",
  AUTHORIZED = "authorized",
  REGISTERED = "registered",
}

export type AuthStatusError = AxiosError<string> | Error;

export type AuthStatusQueryPending = {
  pending: true;
};
export type AuthStatusQueryError = {
  pending: false;
  error: AuthStatusError;
};
export type AuthStatusQueryResult = {
  pending: false;
  data: AuthStatus;
};
/**
 * Representation of a query for the user's authentication/authorization
 * status. Authenication/authorization status is indeterminite when pending
 * (i.e. query is in progress) or error (i.e. query failed). Otherwise,
 * includes a data component representing the AuthStatus of the user.
 */
export type AuthStatusQuery =
  | AuthStatusQueryPending
  | AuthStatusQueryError
  | AuthStatusQueryResult;

/**
 * Given an AuthStatusQuery, returns true when it is an AuthStatusQueryPending.
 * @param asq an AuthStatusQuery
 * @returns true when asq is an AuthStatusQueryPending.
 */
export const isPending = (
  asq: AuthStatusQuery
): asq is AuthStatusQueryPending => asq.pending;

/**
 * Given an AuthStatusQuery, returns true when it is an AuthStatusQueryError.
 * @param asq an AuthStatusQuery
 * @returns true when asq is an AuthStatusQueryError.
 */
export const isError = (asq: AuthStatusQuery): asq is AuthStatusQueryError =>
  !asq.pending && !!(asq as Partial<AuthStatusQueryError>).error;

/**
 * Given an AuthStatusQuery, returns true when it is an AuthStatusQueryResult.
 * @param asq an AuthStatusQuery
 * @returns true when asq is an AuthStatusQueryResult.
 */
export const isResult = (asq: AuthStatusQuery): asq is AuthStatusQueryResult =>
  !asq.pending && !!(asq as Partial<AuthStatusQueryResult>).data;

/**
 * Hook that returns an {@linkcode AuthStatusQuery}
 *
 * @returns
 */
const useAuthStatus = (): AuthStatusQuery => {
  const { isLoading, data, error } = useQuery<AuthStatus, AuthStatusError>(
    [...queryKey, "authstatus"],
    async () => {
      const { data, status } = await axios.get<User.Get.ResBody | string>(
        path,
        {
          validateStatus: (status) => [200, 401, 403].includes(status),
        }
      );
      if (status === 401) {
        return AuthStatus.UNAUTHENTICATED;
      }
      if (status === 403) {
        return AuthStatus.AUTHENTICATED;
      }
      if (
        status === 200 &&
        typeof data !== "string" &&
        data.incompleteRegistration
      ) {
        return AuthStatus.AUTHORIZED;
      }
      if (
        status === 200 &&
        typeof data !== "string" &&
        !data.incompleteRegistration
      ) {
        return AuthStatus.REGISTERED;
      }
      throw new Error(
        `Could not determine data from\n${JSON.stringify(
          { status, data },
          null,
          " "
        )}`
      );
    }
  );
  if (error) return { pending: false, error };
  if (data) return { pending: false, data };
  if (isLoading) return { pending: true };
  return {
    pending: false,
    error: new Error(
      `Could not construct AuthStatusQuery from\n${JSON.stringify(
        {
          isLoading,
          error,
          data,
        },
        null,
        " "
      )}`
    ),
  };
};

export default useAuthStatus;
