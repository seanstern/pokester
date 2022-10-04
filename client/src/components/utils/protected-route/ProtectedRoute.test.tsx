import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider, setLogger } from "react-query";
import { MemoryRouter, Route } from "react-router-dom";
import { isAuthStatusResult } from "../../../queries/user";
import * as UseAuthStatusFixtures from "../../../queries/user/__fixtures__/useAuthStatus";
import server from "../../../__fixtures__/server";
import { defaultAriaLabel } from "../LoadingProgress";
import ProtectedRoute, {
  AuthStatus,
  AuthStatusRejectionHandler,
  authStatusToRedirect,
} from "./ProtectedRoute";

setLogger({ log: console.log, warn: console.warn, error: () => {} });

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const authStatusResultCases = Object.values(UseAuthStatusFixtures).filter(
  ({ query }) => isAuthStatusResult(query)
);

describe("default rejection handler renders", () => {
  test("loading progress when auth status pending", async () => {
    server.use(UseAuthStatusFixtures.pending.mswRestHandler);

    const protectedChildId = "protectedChildId";

    render(
      <QueryClientProvider
        client={
          new QueryClient({
            defaultOptions: {
              queries: {
                retry: false,
              },
            },
          })
        }
      >
        <MemoryRouter>
          <ProtectedRoute
            path="*"
            allow={[
              AuthStatus.UNAUTHENTICATED,
              AuthStatus.AUTHENTICATED,
              AuthStatus.AUTHORIZED,
              AuthStatus.REGISTERED,
            ]}
          >
            <div data-testid="protectedChildId">protected child</div>
          </ProtectedRoute>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.queryByTestId(protectedChildId)).toBeNull();
    await screen.findByRole("progressbar", { name: defaultAriaLabel });
    expect(screen.queryByTestId(protectedChildId)).toBeNull();
  });

  test("error snackbar when auth status error", async () => {
    server.use(UseAuthStatusFixtures.error.mswRestHandler);

    const protectedChildId = "protectedChildId";

    render(
      <QueryClientProvider
        client={
          new QueryClient({
            defaultOptions: {
              queries: {
                retry: false,
              },
            },
          })
        }
      >
        <MemoryRouter>
          <ProtectedRoute
            path="*"
            allow={[
              AuthStatus.UNAUTHENTICATED,
              AuthStatus.AUTHENTICATED,
              AuthStatus.AUTHORIZED,
              AuthStatus.REGISTERED,
            ]}
          >
            <div data-testid="protectedChildId">protected child</div>
          </ProtectedRoute>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.queryByTestId(protectedChildId)).toBeNull();
    await screen.findByRole("alert");
    expect(screen.queryByTestId(protectedChildId)).toBeNull();
  });

  test.each(authStatusResultCases)(
    "appropriate redirect when auth status is $query.data",
    async ({ query, mswRestHandler }) => {
      server.use(mswRestHandler);

      const protectedChildId = "protectedChildId";

      let pathname: string | undefined;
      render(
        <QueryClientProvider
          client={
            new QueryClient({
              defaultOptions: {
                queries: {
                  retry: false,
                },
              },
            })
          }
        >
          <MemoryRouter>
            <ProtectedRoute path="*" allow={[]}>
              <div data-testid="protectedChildId">protected child</div>
            </ProtectedRoute>
            <Route
              path="*"
              render={({ location }) => {
                pathname = location.pathname;
                return null;
              }}
            />
          </MemoryRouter>
        </QueryClientProvider>
      );

      if (!isAuthStatusResult(query)) {
        throw new Error("query not properly filtered");
      }

      expect(screen.queryByTestId(protectedChildId)).toBeNull();
      await waitFor(() =>
        expect(pathname).toBe(authStatusToRedirect[query.data])
      );
      expect(screen.queryByTestId(protectedChildId)).toBeNull();
    }
  );
});

describe("custom rejection handler called with", () => {
  test.each(Object.values(UseAuthStatusFixtures))(
    "$query when rejected",
    async ({ query, mswRestHandler }) => {
      server.use(mswRestHandler);

      const protectedChildId = "protectedChildId";

      const mockReject = jest.fn<
        ReturnType<AuthStatusRejectionHandler>,
        Parameters<AuthStatusRejectionHandler>
      >(() => null);

      render(
        <QueryClientProvider
          client={
            new QueryClient({
              defaultOptions: {
                queries: {
                  retry: false,
                },
              },
            })
          }
        >
          <MemoryRouter>
            <ProtectedRoute path="*" allow={[]} reject={mockReject}>
              <div data-testid="protectedChildId">protected child</div>
            </ProtectedRoute>
          </MemoryRouter>
        </QueryClientProvider>
      );

      expect(screen.queryByTestId(protectedChildId)).toBeNull();
      await waitFor(() => expect(mockReject).toHaveBeenCalledWith(query));
      expect(screen.queryByTestId(protectedChildId)).toBeNull();
    }
  );
});

describe("renders children when", () => {
  test.each(authStatusResultCases)(
    "$query.data is in allow prop",
    async ({ query, mswRestHandler }) => {
      server.use(mswRestHandler);

      if (!isAuthStatusResult(query)) {
        throw new Error("query not properly filtered");
      }

      const protectedChildId = "protectedChildId";

      render(
        <QueryClientProvider
          client={
            new QueryClient({
              defaultOptions: {
                queries: {
                  retry: false,
                },
              },
            })
          }
        >
          <MemoryRouter>
            <ProtectedRoute path="*" allow={query.data}>
              <div data-testid="protectedChildId">protected child</div>
            </ProtectedRoute>
          </MemoryRouter>
        </QueryClientProvider>
      );
      await screen.findByTestId(protectedChildId);
    }
  );

  test.each(authStatusResultCases)(
    "all auth statuses are in allow prop",
    async ({ query, mswRestHandler }) => {
      server.use(mswRestHandler);

      if (!isAuthStatusResult(query)) {
        throw new Error("query not properly filtered");
      }

      const protectedChildId = "protectedChildId";

      render(
        <QueryClientProvider
          client={
            new QueryClient({
              defaultOptions: {
                queries: {
                  retry: false,
                },
              },
            })
          }
        >
          <MemoryRouter>
            <ProtectedRoute
              path="*"
              allow={[
                AuthStatus.UNAUTHENTICATED,
                AuthStatus.AUTHENTICATED,
                AuthStatus.AUTHORIZED,
                AuthStatus.REGISTERED,
              ]}
            >
              <div data-testid="protectedChildId">protected child</div>
            </ProtectedRoute>
          </MemoryRouter>
        </QueryClientProvider>
      );
      await screen.findByTestId(protectedChildId);
    }
  );
});
