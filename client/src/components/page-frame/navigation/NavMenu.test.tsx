import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider, setLogger } from "react-query";
import { MemoryRouter, Route } from "react-router-dom";
import * as UseAuthStatusFixtures from "../../../queries/user/useAuthStatus.fixture";
import server from "../../../__fixtures__/server";
import { AuthStatus, flatNavConfig } from "./navConfig";
import NavMenu, { display, navMenuLabel } from "./NavMenu";

setLogger({ log: console.log, warn: console.warn, error: () => {} });

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("display", () => {
  const displayCases: [
    Parameters<typeof display>,
    ReturnType<typeof display>
  ][] = [
    [[UseAuthStatusFixtures.pending.query, undefined], true],
    [[UseAuthStatusFixtures.pending.query, { authStatusPending: true }], true],
    [
      [
        UseAuthStatusFixtures.pending.query,
        {
          authStatus: [
            AuthStatus.AUTHENTICATED,
            AuthStatus.AUTHORIZED,
            AuthStatus.REGISTERED,
            AuthStatus.UNAUTHENTICATED,
          ],
          authStatusError: true,
        },
      ],
      false,
    ],
    [[UseAuthStatusFixtures.error.query, undefined], true],
    [[UseAuthStatusFixtures.error.query, { authStatusError: true }], true],
    [
      [
        UseAuthStatusFixtures.error.query,
        {
          authStatus: [
            AuthStatus.AUTHENTICATED,
            AuthStatus.AUTHORIZED,
            AuthStatus.REGISTERED,
            AuthStatus.UNAUTHENTICATED,
          ],
          authStatusPending: true,
        },
      ],
      false,
    ],
    [[UseAuthStatusFixtures.unauthenticated.query, undefined], true],
    [
      [
        UseAuthStatusFixtures.unauthenticated.query,
        { authStatus: AuthStatus.UNAUTHENTICATED },
      ],
      true,
    ],
    [
      [
        UseAuthStatusFixtures.unauthenticated.query,
        { authStatus: [AuthStatus.UNAUTHENTICATED, AuthStatus.AUTHENTICATED] },
      ],
      true,
    ],
    [
      [
        UseAuthStatusFixtures.unauthenticated.query,
        {
          authStatus: [
            AuthStatus.AUTHENTICATED,
            AuthStatus.AUTHORIZED,
            AuthStatus.REGISTERED,
          ],
          authStatusError: true,
          authStatusPending: true,
        },
      ],
      false,
    ],
    [[UseAuthStatusFixtures.authenticated.query, undefined], true],
    [
      [
        UseAuthStatusFixtures.authenticated.query,
        { authStatus: AuthStatus.AUTHENTICATED },
      ],
      true,
    ],
    [
      [
        UseAuthStatusFixtures.authenticated.query,
        { authStatus: [AuthStatus.UNAUTHENTICATED, AuthStatus.AUTHENTICATED] },
      ],
      true,
    ],
    [
      [
        UseAuthStatusFixtures.authenticated.query,
        {
          authStatus: [
            AuthStatus.UNAUTHENTICATED,
            AuthStatus.AUTHORIZED,
            AuthStatus.REGISTERED,
          ],
          authStatusError: true,
          authStatusPending: true,
        },
      ],
      false,
    ],
  ];
  test.each(displayCases)("given %j returns %p", (args, expected) =>
    expect(display(...args)).toBe(expected)
  );
});

const navMenuLinks = flatNavConfig.filter(({ hasChildren }) => !hasChildren);

describe.each(Object.values(UseAuthStatusFixtures))(
  "renders navigation menu when useAuthStatus is $query",
  ({ query, mswRestHandler }) => {
    const displayedNavMenuLinks = navMenuLinks.filter(
      ({ effectiveDisplayOn }) => display(query, effectiveDisplayOn)
    );

    const hiddenNavMenuElements = flatNavConfig.filter(
      ({ effectiveDisplayOn }) => !display(query, effectiveDisplayOn)
    );

    test.each(displayedNavMenuLinks)(
      "with link to $title under appropriate navConfig category",
      async ({ humanName, ancestorHumanNames, path, nativeLink }) => {
        server.use(mswRestHandler);

        const user = userEvent.setup();

        let pathname: string | undefined;
        let { container } = render(
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
              <NavMenu />
              <Route
                path="*"
                render={({ location }) => {
                  pathname = `${location.pathname}${location.hash}`;
                  return null;
                }}
              />
            </MemoryRouter>
          </QueryClientProvider>
        );

        const navContainer = within(container).getByRole("navigation", {
          name: navMenuLabel,
        });

        container = navContainer;
        for (let ancestorHumanName of ancestorHumanNames) {
          container = await within(container).findByRole("list", {
            name: ancestorHumanName,
          });
        }
        const link = within(container).getByRole("link", { name: humanName });

        let maybeContainer: HTMLElement | null = navContainer;
        hiddenNavMenuElements.forEach(({ hasChildren, humanName }) => {
          maybeContainer = navContainer;
          for (let ancestorHumanName of ancestorHumanNames) {
            if (maybeContainer === null) {
              break;
            }
            maybeContainer = within(maybeContainer).queryByRole("list", {
              name: ancestorHumanName,
            });
          }
          if (maybeContainer === null) {
            return;
          }
          const role = hasChildren ? "list" : "link";
          expect(
            within(maybeContainer).queryByRole(role, { name: humanName })
          ).toBeNull();
        });

        expect(link).toHaveAttribute("href", path);

        if (!nativeLink) {
          await user.click(link);
        }

        const expectedPath = nativeLink ? "/" : path;
        expect(pathname).toBe(expectedPath);
      }
    );
  }
);
