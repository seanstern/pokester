import { FC } from "react";
import { Redirect, Switch, useRouteMatch } from "react-router-dom";
import AccountEditor from "../components/account-editor";
import ProtectedRoute, {
  AuthStatus,
} from "../components/utils/protected-route";
import Waitlist from "../components/waitlist";

/**
 * Returns router for account related pages.
 *
 * @returns router for account related pages.
 */
const Account: FC = () => {
  const { path, url } = useRouteMatch();
  return (
    <Switch>
      <ProtectedRoute
        exact
        strict
        path={`${path}/edit`}
        allow={[AuthStatus.AUTHORIZED, AuthStatus.REGISTERED]}
      >
        <AccountEditor />
      </ProtectedRoute>
      <ProtectedRoute
        exact
        strict
        path={`${path}/waitlist`}
        allow={[AuthStatus.AUTHENTICATED]}
      >
        <Waitlist />
      </ProtectedRoute>
      <Redirect to={`${url}/edit`} />
    </Switch>
  );
};

export default Account;
