import { PokerRooms } from "@pokester/common-api";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import server from "../../../__fixtures__/server";
import withInjectedActInRoom from "../test-utils/withInjectedActInRoom";
import RawSeat, {
  getInviteMailTo,
  getSeatRegionLabel,
  inviteLabel,
} from "./Seat";

const Seat = withInjectedActInRoom("someRoomId", RawSeat);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("renders initial", () => {
  test("enabled sit button, no invite link when canSit is true", async () => {
    const seatNumber = 1;
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <Seat seatNumber={seatNumber} canSit={true} showInvite={true} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const seatRegion = screen.getByRole("region", {
      name: getSeatRegionLabel(seatNumber),
    });

    const sitButton = within(seatRegion).getByRole("button", {
      name: PokerRooms.Act.PlayerAction.SIT,
    });
    expect(sitButton).toBeEnabled();

    const inviteLink = within(seatRegion).queryByRole("link", {
      name: inviteLabel,
    });
    expect(inviteLink).toBeNull();
  });

  test("enabled invite link when canSit is false, showInvite is true", async () => {
    const seatNumber = 1;
    const pathname = "/foo/bar/baz";
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[pathname]} initialIndex={0}>
          <Seat seatNumber={seatNumber} canSit={false} showInvite={true} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const seatRegion = screen.getByRole("region", {
      name: getSeatRegionLabel(seatNumber),
    });

    const inviteLink = within(seatRegion).getByRole("link", {
      name: inviteLabel,
    });
    expect(inviteLink).toBeEnabled();
    expect(inviteLink).toHaveAttribute("href", getInviteMailTo(pathname));

    const sitButton = within(seatRegion).queryByRole("button", {
      name: PokerRooms.Act.PlayerAction.SIT,
    });
    expect(sitButton).toBeNull();
  });

  test("no link, button when canSit is false, showInvite is falsy", async () => {
    const seatNumber = 1;
    const pathname = "/foo/bar/baz";
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[pathname]} initialIndex={0}>
          <Seat seatNumber={seatNumber} canSit={false} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const seatRegion = screen.getByRole("region", {
      name: getSeatRegionLabel(seatNumber),
    });

    const inviteLink = within(seatRegion).queryByRole("link", {
      name: inviteLabel,
    });
    expect(inviteLink).toBeNull();

    const sitButton = within(seatRegion).queryByRole("button", {
      name: PokerRooms.Act.PlayerAction.SIT,
    });
    expect(sitButton).toBeNull();
  });
});

test("during submission disables sit button", async () => {
  const user = userEvent.setup();

  const seatNumber = 1;
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <Seat seatNumber={seatNumber} canSit={true} />
      </MemoryRouter>
    </QueryClientProvider>
  );

  const seatRegion = screen.getByRole("region", {
    name: getSeatRegionLabel(seatNumber),
  });

  const sitButton = within(seatRegion).getByRole("button", {
    name: PokerRooms.Act.PlayerAction.SIT,
  });

  await user.click(sitButton);

  expect(sitButton).toBeDisabled();

  await waitFor(() => expect(sitButton).toBeEnabled());
});
