import { FC } from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import RoomCreator from "../components/room-creator";
import RoomsList from "../components/rooms-list";

/**
 * Returns router for account rooms related pages.
 *
 * @returns router for rooms related pages.
 */
const Rooms: FC = () => {
  const { path, url } = useRouteMatch();
  return (
    <Switch>
      <Route exact strict path={`${path}/browse`}>
        <RoomsList />
      </Route>
      <Route exact strict path={`${path}/create`}>
        <RoomCreator />
      </Route>
      <Redirect to={`${url}/browse`} />
    </Switch>
  );
};

export default Rooms;
