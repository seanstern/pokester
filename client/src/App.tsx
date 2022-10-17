import CssBaseline from "@mui/material/CssBaseline";
import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FC, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import PageFrame from "./components/page-frame";
import ScrollToTop from "./components/utils/ScrollToTop";
import Routes from "./routes";

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
          primary: prefersDarkMode ? { main: "#fdd835" } : { main: "#4527a0" },
          secondary: prefersDarkMode
            ? { main: "#4527a0" }
            : { main: "#fdd835" },
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
            <Routes />
          </PageFrame>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
