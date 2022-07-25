import { deepPurple, orange } from "@mui/material/colors";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { FC, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import RoomsList from "./components/rooms-list";
import CreateRoom from "./CreateRoom";
import Room from "./Room";

const qc = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

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
        <Router>
          <Container>
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
    </ThemeProvider>
  );
};

export default App;
