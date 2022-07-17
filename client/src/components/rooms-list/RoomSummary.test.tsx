import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import RoomSummary, { RoomSummaryProps } from "./RoomSummary";

const roomId = "roomId";
const roomName = "roomName";
const creatorId = "creatorId";
const act = {
  mutateAsync: jest.fn(() => Promise.resolve()),
  isLoading: false,
} as unknown as RoomSummaryProps["act"];

test("renders room summary with sit button that, when clicked, calls act mutation and changes location", async () => {
  let pathName: string | undefined;
  render(
    <MemoryRouter>
      <RoomSummary
        {...{ id: roomId, name: roomName, creatorId }}
        act={act}
        canSit={true}
        isSeated={false}
      />
      <Route
        path="*"
        render={({ location }) => {
          pathName = location.pathname;
          return null;
        }}
      />
    </MemoryRouter>
  );

  screen.getByRole("article", { name: roomName });

  screen.getByRole("button", { name: roomName });

  screen.getByRole("heading", { level: 2, name: roomName });

  const sitButton = screen.getByRole("button", { name: /sit/i });
  expect(sitButton).toBeEnabled();

  const watchLink = screen.getByRole("link", { name: /watch/i });
  expect(watchLink).toBeEnabled();

  const returnLink = screen.queryByRole("link", { name: /return/i });
  expect(returnLink).toBeNull();

  expect(pathName).toBe("/");
  fireEvent.click(sitButton);
  await waitFor(() => expect(act.mutateAsync).toHaveBeenCalledTimes(1));
  expect(pathName).toBe(`/rooms/${roomId}`);
});

test("renders room summary with watch link that, when clicked, changes location", async () => {
  let pathName: string | undefined;
  render(
    <MemoryRouter>
      <RoomSummary
        {...{ id: roomId, name: roomName, creatorId }}
        act={act}
        canSit={true}
        isSeated={false}
      />
      <Route
        path="*"
        render={({ location }) => {
          pathName = location.pathname;
          return null;
        }}
      />
    </MemoryRouter>
  );

  screen.getByRole("article", { name: roomName });

  screen.getByRole("button", { name: roomName });

  screen.getByRole("heading", { level: 2, name: roomName });

  screen.getByText(creatorId);

  const sitButton = screen.getByRole("button", { name: /sit/i });
  expect(sitButton).toBeEnabled();

  const watchLink = screen.getByRole("link", { name: /watch/i });
  expect(watchLink).toBeEnabled();

  const returnLink = screen.queryByRole("link", { name: /return/i });
  expect(returnLink).toBeNull();

  expect(pathName).toBe("/");
  fireEvent.click(sitButton);
  await waitFor(() => expect(act.mutateAsync).toHaveBeenCalledTimes(1));
  expect(pathName).toBe(`/rooms/${roomId}`);
});

test("renders room summary with disabled sit button and return link that, when clicked, changes location", async () => {
  let pathName: string | undefined;
  render(
    <MemoryRouter>
      <RoomSummary
        {...{ id: roomId, name: roomName, creatorId }}
        act={act}
        canSit={false}
        isSeated={true}
      />
      <Route
        path="*"
        render={({ location }) => {
          pathName = location.pathname;
          return null;
        }}
      />
    </MemoryRouter>
  );

  screen.getByRole("article", { name: roomName });

  screen.getByRole("button", { name: roomName });

  screen.getByRole("heading", { level: 2, name: roomName });

  screen.getByText(creatorId);

  const sitButton = screen.getByRole("button", { name: /sit/i });
  expect(sitButton).toBeDisabled();

  const returnLink = screen.getByRole("link", { name: /return/i });
  expect(returnLink).toBeEnabled();

  const watchLink = screen.queryByRole("link", { name: /watch/i });
  expect(watchLink).toBeNull();

  expect(pathName).toBe("/");

  fireEvent.click(sitButton);
  expect(pathName).toBe("/");

  fireEvent.click(returnLink);
  expect(pathName).toBe(`/rooms/${roomId}`);

  expect(act.mutateAsync).not.toHaveBeenCalled();
});

test("renders room summary with action area that, when clicked, changes location", async () => {
  let pathName: string | undefined;
  render(
    <MemoryRouter>
      <RoomSummary
        {...{ id: roomId, name: roomName, creatorId }}
        act={act}
        canSit={false}
        isSeated={true}
      />
      <Route
        path="*"
        render={({ location }) => {
          pathName = location.pathname;
          return null;
        }}
      />
    </MemoryRouter>
  );

  screen.getByRole("article", { name: roomName });

  const actionArea = screen.getByRole("button", { name: roomName });

  screen.getByRole("heading", { level: 2, name: roomName });

  screen.getByText(creatorId);

  const sitButton = screen.getByRole("button", { name: /sit/i });
  expect(sitButton).toBeDisabled();

  const returnLink = screen.getByRole("link", { name: /return/i });
  expect(returnLink).toBeEnabled();

  const watchLink = screen.queryByRole("link", { name: /watch/i });
  expect(watchLink).toBeNull();

  expect(pathName).toBe("/");

  fireEvent.click(sitButton);
  expect(pathName).toBe("/");

  fireEvent.click(actionArea);
  expect(act.mutateAsync).not.toHaveBeenCalled();
  await waitFor(() => expect(pathName).toBe(`/rooms/${roomId}`));
});

test("renders room summary with disabled sit button when act is loading", async () => {
  let pathName: string | undefined;
  const loadingAct = { ...act };
  loadingAct.isLoading = true;
  render(
    <MemoryRouter>
      <RoomSummary
        {...{ id: roomId, name: roomName, creatorId }}
        act={loadingAct}
        canSit={true}
        isSeated={false}
      />
      <Route
        path="*"
        render={({ location }) => {
          pathName = location.pathname;
          return null;
        }}
      />
    </MemoryRouter>
  );

  screen.getByRole("article", { name: roomName });

  screen.getByRole("button", { name: roomName });

  screen.getByRole("heading", { level: 2, name: roomName });

  screen.getByText(creatorId);

  const sitButton = screen.getByRole("button", { name: /sit/i });
  expect(sitButton).toBeDisabled();

  const watchLink = screen.getByRole("link", { name: /watch/i });
  expect(watchLink).toBeEnabled();

  const returnLink = screen.queryByRole("link", { name: /return/i });
  expect(returnLink).toBeNull();

  expect(pathName).toBe("/");

  fireEvent.click(sitButton);
  expect(act.mutateAsync).not.toHaveBeenCalled();
  expect(pathName).toBe("/");
});

test("renders skeleton room summary", () => {
  render(
    <MemoryRouter>
      <RoomSummary skeleton />
    </MemoryRouter>
  );

  expect(screen.queryByRole("article", { name: roomName })).toBeNull();

  expect(screen.queryByRole("button", { name: roomName })).toBeNull();

  expect(
    screen.queryByRole("heading", { level: 2, name: roomName })
  ).toBeNull();

  expect(screen.queryByText(creatorId)).toBeNull();

  expect(screen.queryByRole("button", { name: /sit/i })).toBeNull();

  expect(screen.queryByRole("link", { name: /watch/i })).toBeNull();

  expect(screen.queryByRole("link", { name: /return/i })).toBeNull();
});
