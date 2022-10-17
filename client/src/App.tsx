import { FC } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import PageFrame from "./components/page-frame";
import { ThemeProvider } from "./theme";
import ScrollToTop from "./components/utils/ScrollToTop";
import Routes from "./routes";

const qc = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const App: FC = () => (
  <ThemeProvider>
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

export default App;
