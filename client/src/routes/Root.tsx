import { FC } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "../components/home";
import Room from "../components/room";
import ProtectedRoute, {
  AuthStatus,
} from "../components/utils/protected-route";
import Account from "./Account";
import Rooms from "./Rooms";

/**
 * Returns router for app.
 *
 * @returns router for app.
 */
const Root: FC = () => (
  <Switch>
    <Route strict exact path="/">
      <Home />
    </Route>
    <Route strict path="/account">
      <Account />
    </Route>
    <ProtectedRoute strict path="/rooms" allow={AuthStatus.REGISTERED}>
      <Rooms />
    </ProtectedRoute>
    <ProtectedRoute
      strict
      exact
      path="/room/:roomId"
      allow={AuthStatus.REGISTERED}
    >
      <Room />
    </ProtectedRoute>
    <Redirect to="/" />
  </Switch>
);

export default Root;
