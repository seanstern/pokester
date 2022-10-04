import { FC, ReactNode } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import {
  AuthStatus,
  useAuthStatus,
  AuthStatusQuery,
  isAuthStatusPending,
  isAuthStatusResult,
  isAuthStatusError,
} from "../../../queries/user";
import ErrorSnackbar from "../ErrorSnackbar";
import LoadingProgress from "../LoadingProgress";

export {
  AuthStatus,
  isAuthStatusPending,
  isAuthStatusError,
  isAuthStatusResult,
};

export const authStatusToRedirect: Readonly<Record<AuthStatus, string>> = {
  [AuthStatus.UNAUTHENTICATED]: "/",
  [AuthStatus.AUTHENTICATED]: "/account/waitlist",
  [AuthStatus.AUTHORIZED]: "/account/edit",
  [AuthStatus.REGISTERED]: "/rooms/browse",
};

export type AuthStatusRejectionHandler = (
  rejection: AuthStatusQuery
) => ReactNode;

/**
 * Given an auth status query that is not on the a protected route's allow
 * list, returns a ReactNode to render in place of the protected route's
 * children:
 *   - pending renders loading progress
 *   - error renders an error snackbar
 *   - registered renders redirect to "/rooms/browse"
 *   - authorized renders redirect to "/account/edit"
 *   - authenticated renders redirect to "/account/waitlist"
 *   - anauthenticated renders redirect to "/"
 * @param rejection an auth status query that the protected route's allow list
 * @returns a ReactNode to render in place of the protected route's children:
 *   - pending renders loading progress
 *   - error renders an error snackbar
 *   - registered renders redirect to "/rooms/browse"
 *   - authorized renders redirect to "/account/edit"
 *   - authenticated renders redirect to "/account/waitlist"
 *   - anauthenticated renders redirect to "/"
 */
const defaultReject: AuthStatusRejectionHandler = (rejection) => {
  if (isAuthStatusPending(rejection)) {
    return <LoadingProgress show />;
  }

  if (isAuthStatusResult(rejection)) {
    return <Redirect to={authStatusToRedirect[rejection.data]} />;
  }

  return <ErrorSnackbar show />;
};

export type ProtectedRouteProps = {
  allow: AuthStatus | AuthStatus[];
  reject?: AuthStatusRejectionHandler;
} & RouteProps;
/**
 * Given props, returns a protected route--that is a route that only renders
 * children when the auth status of a user is one of the entries in the allow
 * prop.
 *
 * @param props
 * @param props.allow the user auth statuses which will render children; when
 *   the user auth status does not match an element of this prop, the reject
 *   prop will be called to determine what is rendered.
 * @param props.reject an optional render prop for handling AuthStatusQueries
 *   that aren't included in allow; defaults to following behavior
 *     - pending renders loading progress
 *     - error renders an error snackbar
 *     - registered renders redirect to "/rooms/browse"
 *     - authorized renders redirect to "/account/edit"
 *     - authenticated renders redirect to "/account/waitlist"
 *     - anauthenticated renders redirect to "/"
 * @returns a route that renders children when auth status of a user is one
 *   of the entries in the allow prop; a route that renders the return value
 *   of reject otherwise
 */
const ProtectedRoute: FC<ProtectedRouteProps> = ({
  allow: allowProp,
  reject: rejectProp,
  children: childrenProp,
  ...rest
}) => {
  const authStatusQuery = useAuthStatus();

  const allow = Array.isArray(allowProp) ? allowProp : [allowProp];
  const reject = rejectProp || defaultReject;
  const children =
    isAuthStatusPending(authStatusQuery) ||
    isAuthStatusError(authStatusQuery) ||
    (isAuthStatusResult(authStatusQuery) &&
      !allow.includes(authStatusQuery.data))
      ? reject(authStatusQuery)
      : childrenProp;

  return <Route {...rest}>{children}</Route>;
};

export default ProtectedRoute;
