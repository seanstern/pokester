import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Room from "./Room";
import { PokerRooms } from "@pokester/common-api";
import server from "../../__fixtures__/server";
import { QueryClient, QueryClientProvider, setLogger } from "react-query";
import { success, serverError } from "../../queries/poker-rooms/useGet.fixture";
import { badRequest } from "../../queries/poker-rooms/useAct.fixture";
import { MemoryRouter } from "react-router-dom";
import { getSeatRegionLabel } from "./seat/Seat";
import { communityCardsRegionLabel } from "./community-cards/CommunityCards";
import { potsRegionLabel, sidePotsRegionLabel } from "./pots/Pots";
import { playerActionsLabel } from "./player-actions/PlayerActions";

setLogger({ log: console.log, warn: console.warn, error: () => {} });

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test.each(Object.values(success))(
  "renders regions for $description",
  async ({ resBody, mswRestHandler }) => {
    server.use(mswRestHandler);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[`/room/${resBody.id}`]} initialIndex={0}>
          <Room />
        </MemoryRouter>
      </QueryClientProvider>
    );

    screen.getByRole("progressbar");
    expect(screen.queryByRole("alert")).toBeNull();

    await waitFor(() => expect(screen.queryByRole("progressbar")).toBeNull());

    resBody.table.players.forEach((p, idx) =>
      screen.getByRole("region", { name: p?.id || getSeatRegionLabel(idx) })
    );
    screen.getByRole("region", { name: communityCardsRegionLabel });
    screen.getByRole("region", { name: potsRegionLabel });
    expect(screen.queryByRole("region", { name: sidePotsRegionLabel })).toEqual(
      resBody.table.pots.length > 1 ? expect.anything() : null
    );
    screen.getByRole("region", { name: playerActionsLabel });
  }
);

test("renders alert bad request body", async () => {
  const user = userEvent.setup();

  const { mswRestHandler: getMswRestHandler, resBody: getResBody } =
    success.opponentsInEmptyTable;
  server.use(getMswRestHandler);

  const { mswRestHandler: actMswRestHandler, resBody: actResBody } = badRequest;
  server.use(actMswRestHandler);

  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter
        initialEntries={[`/room/${getResBody.id}`]}
        initialIndex={0}
      >
        <Room />
      </MemoryRouter>
    </QueryClientProvider>
  );

  screen.getByRole("progressbar");
  expect(screen.queryByRole("alert")).toBeNull();

  await waitFor(() => expect(screen.queryByRole("progressbar")).toBeNull());

  const [sitButton] = screen.getAllByRole("button", {
    name: PokerRooms.Get.PlayerAction.SIT,
  });

  await user.click(sitButton);

  screen.getByRole("progressbar");

  await waitFor(() => expect(screen.queryByRole("progressbar")).toBeNull());
  within(screen.getByRole("alert")).getByText(actResBody);
});

test("renders alert on server error", async () => {
  server.use(serverError.mswRestHandler);

  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <MemoryRouter initialEntries={[`/room/anyroom`]} initialIndex={0}>
        <Room />
      </MemoryRouter>
    </QueryClientProvider>
  );

  screen.getByRole("progressbar");
  expect(screen.queryByRole("alert")).toBeNull();

  await waitFor(() => expect(screen.queryByRole("progressbar")).toBeNull());

  screen.getByRole("alert");
});
