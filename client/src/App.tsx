import { deepPurple, orange } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { FC, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import PageFrame from "./components/page-frame";
import Room from "./components/Room";
import RoomCreator from "./components/room-creator/RoomCreator";
import RoomsList from "./components/rooms-list";
import ScrollToTop from "./components/utils/ScrollToTop";

const qc = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

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

const App: FC = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: prefersDarkMode ? orange : deepPurple,
          secondary: prefersDarkMode ? deepPurple : orange,
        },
      }),
    [prefersDarkMode]
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={qc}>
        <BrowserRouter>
          <ScrollToTop />
          <PageFrame>
            <Switch>
              <Route strict path="/rooms">
                <Rooms />
              </Route>
              <Route strict exact path="/room/:roomId">
                <Room />
              </Route>
              <Redirect to="/rooms" />
            </Switch>
          </PageFrame>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
