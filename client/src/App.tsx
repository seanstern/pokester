import React, { FC } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Room from "./Room";
import Rooms from "./Rooms";

const qc = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const App: FC = () => (
  <QueryClientProvider client={qc}>
    <Router>
      <Switch>
        <Route path="/rooms/:roomId">
          <Room />
        </Route>
        <Route path="/rooms">
          <Rooms />
        </Route>
        <Redirect to="/rooms" />
      </Switch>
    </Router>
  </QueryClientProvider>
);

export default App;
