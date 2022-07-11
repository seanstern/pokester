import React, { FC } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
} from "react-router-dom";
import Room from "./Room";
import Rooms from "./Rooms";
import CreateRoom from "./CreateRoom";

const qc = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const App: FC = () => (
  <QueryClientProvider client={qc}>
    <Router>
      <Link to="/create">Create a Room</Link>
      {" or "}
      <Link to="/rooms">Browse Rooms</Link>{" "}
      <Link to={"/rooms?canSit=true"}>(To Join)</Link>{" "}
      <Link to={"/rooms?isSeated=true"}>(You're Already In)</Link>
      <Switch>
        <Route strict path="/rooms/:roomId">
          <Room />
        </Route>
        <Route strict exact path="/rooms">
          <Rooms />
        </Route>
        <Route strict path="/create">
          <CreateRoom />
        </Route>
        <Redirect to="/rooms" />
      </Switch>
    </Router>
  </QueryClientProvider>
);

export default App;
