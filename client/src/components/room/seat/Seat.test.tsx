import { PokerRooms } from "@pokester/common-api";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import server, { validRoomIdForPatch } from "../../../__fixtures__/server";
import Seat, { getSeatRegionLabel } from "./Seat";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders enabled sit button when canSit is true", async () => {
  const user = userEvent.setup();
  const seatNumber = 1;
  render(
    <QueryClientProvider client={new QueryClient()}>
      <Seat
        roomId={validRoomIdForPatch}
        seatNumber={seatNumber}
        canSit={true}
      />
    </QueryClientProvider>
  );

  const seatRegion = screen.getByRole("region", {
    name: getSeatRegionLabel(seatNumber),
  });

  const sitButton = within(seatRegion).getByRole("button", {
    name: PokerRooms.Act.PlayerAction.SIT,
  });
  expect(sitButton).toBeEnabled();

  await user.click(sitButton);
});

test("renders no sit button when canSit is false", async () => {
  const seatNumber = 2;
  render(
    <QueryClientProvider client={new QueryClient()}>
      <Seat
        roomId={validRoomIdForPatch}
        seatNumber={seatNumber}
        canSit={false}
      />
    </QueryClientProvider>
  );

  const seatRegion = screen.getByRole("region", {
    name: getSeatRegionLabel(seatNumber),
  });

  const sitButton = within(seatRegion).queryByRole("button", {
    name: PokerRooms.Act.PlayerAction.SIT,
  });
  expect(sitButton).toBeNull();
});
