import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter, Route } from "react-router-dom";
import RoomSummary from "./RoomSummary";

const id = "roomId";
const name = "roomName";
const creatorId = "creatorId";
const act = {
  mutateAsync: jest.fn(() => Promise.resolve()),
  isLoading: false,
} as unknown as ComponentProps<typeof RoomSummary>["act"];

test("renders room summary with sit button that, when clicked, calls act mutation and changes location", async () => {
  let pathName: string | undefined;
  render(
    <MemoryRouter>
      <RoomSummary
        {...{ id, name, creatorId }}
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

  screen.getByText(name);
  screen.getByText(creatorId);

  const sitButton = screen.getByText(/sit/i);
  expect(sitButton).toBeEnabled();

  const watchButton = screen.getByText(/watch/i);
  expect(watchButton).toBeEnabled();

  const returnButton = screen.queryByText(/return/i);
  expect(returnButton).toBeNull();

  expect(pathName).toBe("/");
  fireEvent.click(sitButton);
  await waitFor(() => expect(act.mutateAsync).toHaveBeenCalledTimes(1));
  expect(pathName).toBe(`/rooms/${id}`);
});

test("renders room summary with watch button that, when clicked, changes location", async () => {
  let pathName: string | undefined;
  render(
    <MemoryRouter>
      <RoomSummary
        {...{ id, name, creatorId }}
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

  screen.getByText(name);
  screen.getByText(creatorId);

  const sitButton = screen.getByText(/sit/i);
  expect(sitButton).toBeEnabled();

  const watchButton = screen.getByText(/watch/i);
  expect(watchButton).toBeEnabled();

  const returnButton = screen.queryByText(/return/i);
  expect(returnButton).toBeNull();

  expect(pathName).toBe("/");
  fireEvent.click(watchButton);
  expect(act.mutateAsync).not.toHaveBeenCalled();
  expect(pathName).toBe(`/rooms/${id}`);
});

test("renders room summary with return button that, when clicked, changes location", async () => {
  let pathName: string | undefined;
  render(
    <MemoryRouter>
      <RoomSummary
        {...{ id, name, creatorId }}
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

  screen.getByText(name);
  screen.getByText(creatorId);

  const sitButton = screen.getByText(/sit/i);
  expect(sitButton).toBeDisabled();

  const returnButton = screen.getByText(/return/i);
  expect(returnButton).toBeEnabled();

  const watchButton = screen.queryByText(/watch/i);
  expect(watchButton).toBeNull();

  expect(pathName).toBe("/");

  fireEvent.click(sitButton);
  expect(pathName).toBe("/");

  fireEvent.click(returnButton);
  expect(pathName).toBe(`/rooms/${id}`);

  expect(act.mutateAsync).not.toHaveBeenCalled();
});

test("renders room summary with action area that, when clicked, changes location", async () => {
  let pathName: string | undefined;
  render(
    <MemoryRouter>
      <RoomSummary
        {...{ id, name, creatorId }}
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

  const nameElement = screen.getByText(name);
  screen.getByText(creatorId);

  const sitButton = screen.getByText(/sit/i);
  expect(sitButton).toBeDisabled();

  const returnButton = screen.getByText(/return/i);
  expect(returnButton).toBeEnabled();

  const watchButton = screen.queryByText(/watch/i);
  expect(watchButton).toBeNull();

  expect(pathName).toBe("/");

  fireEvent.click(sitButton);
  expect(pathName).toBe("/");

  fireEvent.click(nameElement);
  expect(act.mutateAsync).not.toHaveBeenCalled();
  await waitFor(() => expect(pathName).toBe(`/rooms/${id}`));
});

test("renders room summary with disabled sit when act is loading", async () => {
  let pathName: string | undefined;
  const loadingAct = { ...act };
  loadingAct.isLoading = true;
  render(
    <MemoryRouter>
      <RoomSummary
        {...{ id, name, creatorId }}
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

  screen.getByText(name);
  screen.getByText(creatorId);

  const sitButton = screen.getByText(/sit/i);
  expect(sitButton).toBeDisabled();

  const watchButton = screen.getByText(/watch/i);
  expect(watchButton).toBeEnabled();

  const returnButton = screen.queryByText(/return/i);
  expect(returnButton).toBeNull();

  expect(pathName).toBe("/");

  fireEvent.click(sitButton);
  expect(pathName).toBe("/");
});
