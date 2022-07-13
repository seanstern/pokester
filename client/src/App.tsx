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
import RoomsList from "./components/rooms-list";
import CreateRoom from "./CreateRoom";
import Container from "@mui/material/Container";

const qc = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const App: FC = () => (
  <QueryClientProvider client={qc}>
    <Router>
      <Container>
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
            <RoomsList />
          </Route>
          <Route strict path="/create">
            <CreateRoom />
          </Route>
          <Redirect to="/rooms" />
        </Switch>
      </Container>
    </Router>
  </QueryClientProvider>
);

export default App;
