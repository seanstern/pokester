import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import RoomSummary, {
  findByCreatorLinkLabelPrefix,
  returnLinkLabel,
  RoomSummaryProps,
  sitButtonLabel,
  watchLinkLabel,
} from "./RoomSummary";

const roomId = "roomId";
const roomName = "roomName";
const creatorId = "creatorId";
const act = {
  mutateAsync: jest.fn(() => Promise.resolve()),
  isLoading: false,
} as unknown as RoomSummaryProps["act"];

const findByCreatorLinkRegExp = new RegExp(
  `^${findByCreatorLinkLabelPrefix}`,
  "i"
);
const sitButtonRegExp = new RegExp(`^${sitButtonLabel}$`, "i");
const watchLinkRegExp = new RegExp(`^${watchLinkLabel}$`, "i");
const returnLinkRegExp = new RegExp(`^${returnLinkLabel}$`, "i");

test("renders room summary with find by creator button that, when clicked, changes path and query string", async () => {
  let pathName: string | undefined;
  let qs: string | undefined;
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
          qs = location.search;
          return null;
        }}
      />
    </MemoryRouter>
  );

  screen.getByRole("article", { name: roomName });

  screen.getByRole("heading", { level: 2, name: roomName });

  const findByCreatorLink = screen.getByRole("link", {
    name: findByCreatorLinkRegExp,
  });
  expect(findByCreatorLink).toBeEnabled();

  screen.getByText(creatorId);

  const sitButton = screen.getByRole("button", { name: sitButtonRegExp });
  expect(sitButton).toBeEnabled();

  const watchLink = screen.getByRole("link", { name: watchLinkRegExp });
  expect(watchLink).toBeEnabled();

  const returnLink = screen.queryByRole("link", { name: returnLinkRegExp });
  expect(returnLink).toBeNull();

  expect(pathName).toBe("/");
  expect(qs).toBe("");

  fireEvent.click(findByCreatorLink);

  await new Promise((res) => setTimeout(res, 500));
  expect(pathName).toBe("/");
  expect(qs).toBe(`?creatorId=${creatorId}`);
});

test("renders room summary with sit button that, when clicked, calls act mutation and changes path", async () => {
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

  screen.getByRole("heading", { level: 2, name: roomName });

  const findByCreatorLink = screen.getByRole("link", {
    name: findByCreatorLinkRegExp,
  });
  expect(findByCreatorLink).toBeEnabled();

  screen.getByText(creatorId);

  const sitButton = screen.getByRole("button", { name: sitButtonRegExp });
  expect(sitButton).toBeEnabled();

  const watchLink = screen.getByRole("link", { name: watchLinkRegExp });
  expect(watchLink).toBeEnabled();

  const returnLink = screen.queryByRole("link", { name: returnLinkRegExp });
  expect(returnLink).toBeNull();

  expect(pathName).toBe("/");

  fireEvent.click(sitButton);

  await waitFor(() => expect(act.mutateAsync).toHaveBeenCalledTimes(1));
  expect(pathName).toBe(`/rooms/${roomId}`);
});

test("renders room summary with watch link that, when clicked, changes path", async () => {
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

  screen.getByRole("heading", { level: 2, name: roomName });

  const findByCreatorLink = screen.getByRole("link", {
    name: findByCreatorLinkRegExp,
  });
  expect(findByCreatorLink).toBeEnabled();

  screen.getByText(creatorId);

  const sitButton = screen.getByRole("button", { name: sitButtonRegExp });
  expect(sitButton).toBeEnabled();

  const watchLink = screen.getByRole("link", { name: watchLinkRegExp });
  expect(watchLink).toBeEnabled();

  const returnLink = screen.queryByRole("link", { name: returnLinkRegExp });
  expect(returnLink).toBeNull();

  expect(pathName).toBe("/");

  fireEvent.click(watchLink);

  expect(pathName).toBe(`/rooms/${roomId}`);
  expect(act.mutateAsync).not.toHaveBeenCalled();
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

  screen.getByRole("heading", { level: 2, name: roomName });

  const findByCreatorLink = screen.getByRole("link", {
    name: findByCreatorLinkRegExp,
  });
  expect(findByCreatorLink).toBeEnabled();

  screen.getByText(creatorId);

  const sitButton = screen.getByRole("button", { name: sitButtonRegExp });
  expect(sitButton).toBeDisabled();

  const returnLink = screen.getByRole("link", { name: returnLinkRegExp });
  expect(returnLink).toBeEnabled();

  const watchLink = screen.queryByRole("link", { name: watchLinkRegExp });
  expect(watchLink).toBeNull();

  expect(pathName).toBe("/");

  fireEvent.click(sitButton);

  expect(pathName).toBe("/");

  fireEvent.click(returnLink);

  expect(pathName).toBe(`/rooms/${roomId}`);

  expect(act.mutateAsync).not.toHaveBeenCalled();
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

  screen.getByRole("heading", { level: 2, name: roomName });

  const findByCreatorLink = screen.getByRole("link", {
    name: findByCreatorLinkRegExp,
  });
  expect(findByCreatorLink).toBeEnabled();

  screen.getByText(creatorId);

  const sitButton = screen.getByRole("button", { name: sitButtonRegExp });
  expect(sitButton).toBeDisabled();

  const watchLink = screen.getByRole("link", { name: watchLinkRegExp });
  expect(watchLink).toBeEnabled();

  const returnLink = screen.queryByRole("link", { name: returnLinkRegExp });
  expect(returnLink).toBeNull();

  expect(pathName).toBe("/");

  fireEvent.click(sitButton);

  expect(pathName).toBe("/");
  expect(act.mutateAsync).not.toHaveBeenCalled();
});

test("renders skeleton room summary", () => {
  render(
    <MemoryRouter>
      <RoomSummary skeleton />
    </MemoryRouter>
  );

  expect(screen.queryByRole("article", { name: roomName })).toBeNull();

  expect(
    screen.queryByRole("heading", { level: 2, name: roomName })
  ).toBeNull();

  expect(
    screen.queryByRole("link", {
      name: findByCreatorLinkRegExp,
    })
  ).toBeNull();
  expect(screen.queryByText(creatorId)).toBeNull();

  expect(screen.queryByRole("button", { name: sitButtonRegExp })).toBeNull();

  expect(screen.queryByRole("link", { name: watchLinkRegExp })).toBeNull();

  expect(screen.queryByRole("link", { name: returnLinkRegExp })).toBeNull();
});
