import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider, setLogger } from "react-query";
import { MemoryRouter } from "react-router-dom";
import {
  fullyRegisteredDiffUsername,
  unregisteredNoUsername,
  unregisteredNoUsernameUnverifiedEmail,
  unregisteredUnverifiedEmail,
  unregisteredUnverifiedEmailDiffUsername,
} from "../../queries/user/useGet.fixture";
import { badRequest } from "../../queries/user/usePatch.fixture";
import server, { getUserRes } from "../../__fixtures__/server";
import AccountEditor, {
  alertTitle,
  emailLabel,
  emailUnverifiedHelperText,
  emailVerificationMessageLinkLabel,
  emailVerificationMessageLinkTo,
  emailVerifiedHelperText,
  resetFormLabel,
  saveLabel,
  usernameLabel,
  usernameSelectionMessage,
} from "./AccountEditor";

setLogger({ log: console.log, warn: console.warn, error: () => {} });

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders fully registered initial data loading, initial data loaded, invalid input, reset form, saving data, saved data loaded", async () => {
  const user = userEvent.setup();

  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <AccountEditor />
      </MemoryRouter>
    </QueryClientProvider>
  );

  // Testing form when data is initially loading
  screen.getByRole("progressbar");

  const emailTextBox = screen.getByRole("textbox", { name: emailLabel });
  expect(emailTextBox).toHaveAttribute("readonly");
  expect(emailTextBox).toBeDisabled();
  expect(emailTextBox).toHaveDisplayValue("");
  expect(emailTextBox).toHaveAccessibleDescription();
  expect(emailTextBox).toBeValid();

  const usernameTextBox = screen.getByRole("textbox", { name: usernameLabel });
  expect(usernameTextBox).toBeDisabled();
  expect(usernameTextBox).toHaveDisplayValue("");
  expect(usernameTextBox).toHaveAccessibleDescription();
  expect(usernameTextBox).toBeValid();
  expect(usernameTextBox).toBeRequired();

  const saveButton = screen.getByRole("button", { name: saveLabel });
  expect(saveButton).toBeDisabled();

  const resetFormButton = screen.getByRole("button", { name: resetFormLabel });
  expect(resetFormButton).toBeDisabled();

  expect(screen.queryByRole("alert")).toBeNull();

  // Testing form when initial data has loaded

  await waitFor(() => expect(screen.queryByRole("progressbar")).toBeNull());

  expect(emailTextBox).toHaveAttribute("readonly");
  expect(emailTextBox).toBeEnabled();
  expect(emailTextBox).toHaveDisplayValue(getUserRes.email?.address!);
  expect(emailTextBox).toHaveAccessibleDescription(emailVerifiedHelperText);
  expect(emailTextBox).toBeValid();

  expect(usernameTextBox).toBeEnabled();
  expect(usernameTextBox).toHaveDisplayValue(getUserRes.username!);
  expect(usernameTextBox).toHaveAccessibleDescription();
  expect(usernameTextBox).toBeValid();
  expect(usernameTextBox).toBeRequired();

  expect(saveButton).toBeDisabled();

  expect(resetFormButton).toBeDisabled();

  expect(screen.queryByRole("alert")).toBeNull();

  // Testing reset form button

  const usernameSuffix = "foo";
  await user.type(usernameTextBox, usernameSuffix);

  expect(usernameTextBox).toHaveDisplayValue(
    `${getUserRes.username}${usernameSuffix}`
  );

  expect(saveButton).toBeEnabled();

  expect(resetFormButton).toBeEnabled();

  await user.click(resetFormButton);

  expect(usernameTextBox).toHaveDisplayValue(getUserRes.username!);

  expect(saveButton).toBeDisabled();

  expect(resetFormButton).toBeDisabled();

  // Testing save on invalid input

  await user.clear(usernameTextBox);

  expect(saveButton).toBeEnabled();

  expect(resetFormButton).toBeEnabled();

  expect(usernameTextBox).toBeInvalid();
  expect(usernameTextBox).toHaveAccessibleDescription();
  const usernameErrorRegExp = new RegExp(usernameLabel, "i");
  expect(usernameTextBox).not.toHaveAccessibleDescription(usernameErrorRegExp);

  await user.click(saveButton);

  expect(saveButton).toBeDisabled();

  expect(resetFormButton).toBeDisabled();

  expect(usernameTextBox).toBeInvalid();
  expect(usernameTextBox).toHaveAccessibleDescription(usernameErrorRegExp);

  expect(screen.queryByRole("alert")).toBeNull();

  // Testing save on valid input

  const newUsername = fullyRegisteredDiffUsername.resBody.username;

  server.use(fullyRegisteredDiffUsername.mswRestHandler);

  await user.type(usernameTextBox, newUsername);
  await user.click(saveButton);

  // Testing save on valid input; loading newly saved data

  screen.getByRole("progressbar");
  expect(saveButton).toBeDisabled();
  expect(resetFormButton).toBeDisabled();
  expect(emailTextBox).toBeDisabled();
  expect(usernameTextBox).toBeDisabled();
  expect(screen.queryByRole("alert")).toBeNull();

  // Testing save on valid input; newly saved data loaded

  await waitFor(() => expect(screen.queryByRole("progressbar")).toBeNull());

  expect(emailTextBox).toHaveAttribute("readonly");
  expect(emailTextBox).toBeEnabled();
  expect(emailTextBox).toHaveDisplayValue(
    fullyRegisteredDiffUsername.resBody.email?.address!
  );
  expect(emailTextBox).toHaveAccessibleDescription(emailVerifiedHelperText);
  expect(emailTextBox).toBeValid();

  expect(usernameTextBox).toBeEnabled();
  expect(usernameTextBox).toHaveDisplayValue(
    fullyRegisteredDiffUsername.resBody.username
  );
  expect(usernameTextBox).toHaveAccessibleDescription();
  expect(usernameTextBox).toBeValid();
  expect(usernameTextBox).toBeRequired();

  expect(saveButton).toBeDisabled();

  expect(resetFormButton).toBeDisabled();

  expect(screen.queryByRole("alert")).toBeNull();
});

test("renders unregistered (no username) data loading, initial data loaded with info alert, saving data with info alert, saved data loaded with no alert", async () => {
  const user = userEvent.setup();

  server.use(unregisteredNoUsername.mswRestHandler);

  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <AccountEditor />
      </MemoryRouter>
    </QueryClientProvider>
  );

  // Testing form when data is initially loading

  screen.getByRole("progressbar");

  const emailTextBox = screen.getByRole("textbox", { name: emailLabel });
  expect(emailTextBox).toHaveAttribute("readonly");
  expect(emailTextBox).toBeDisabled();
  expect(emailTextBox).toHaveDisplayValue("");
  expect(emailTextBox).toHaveAccessibleDescription();
  expect(emailTextBox).toBeValid();

  const usernameTextBox = screen.getByRole("textbox", { name: usernameLabel });
  expect(usernameTextBox).toBeDisabled();
  expect(usernameTextBox).toHaveDisplayValue("");
  expect(usernameTextBox).toHaveAccessibleDescription();
  expect(usernameTextBox).toBeValid();
  expect(usernameTextBox).toBeRequired();

  const saveButton = screen.getByRole("button", { name: saveLabel });
  expect(saveButton).toBeDisabled();

  const resetFormButton = screen.getByRole("button", { name: resetFormLabel });
  expect(resetFormButton).toBeDisabled();

  expect(screen.queryByRole("alert")).toBeNull();

  // Testing form when initial data has loaded

  await waitFor(() => expect(screen.queryByRole("progressbar")).toBeNull());

  expect(emailTextBox).toHaveAttribute("readonly");
  expect(emailTextBox).toBeEnabled();
  expect(emailTextBox).toHaveDisplayValue(
    unregisteredNoUsername.resBody.email?.address!
  );
  expect(emailTextBox).toHaveAccessibleDescription(emailVerifiedHelperText);
  expect(emailTextBox).toBeValid();

  expect(usernameTextBox).toBeEnabled();
  expect(usernameTextBox).toHaveDisplayValue("");
  expect(usernameTextBox).toHaveAccessibleDescription();
  expect(usernameTextBox).toBeInvalid();
  expect(usernameTextBox).toBeRequired();

  expect(saveButton).toBeDisabled();

  expect(resetFormButton).toBeDisabled();

  let alert = screen.getByRole("alert");
  within(alert).getByText(alertTitle);
  let alertListItems = within(within(alert).getByRole("list")).getAllByRole(
    "listitem"
  );
  expect(alertListItems.length).toBe(1);
  let [alertListItem] = alertListItems;
  within(alertListItem).getByText(usernameSelectionMessage);

  // Testing save on valid input

  const newUsername = fullyRegisteredDiffUsername.resBody.username;

  server.use(fullyRegisteredDiffUsername.mswRestHandler);

  await user.type(usernameTextBox, newUsername);
  await user.click(saveButton);

  // Testing save on valid input; loading newly saved data

  screen.getByRole("progressbar");
  expect(saveButton).toBeDisabled();
  expect(resetFormButton).toBeDisabled();
  expect(emailTextBox).toBeDisabled();
  expect(usernameTextBox).toBeDisabled();
  alert = screen.getByRole("alert");
  within(alert).getByText(alertTitle);
  alertListItems = within(within(alert).getByRole("list")).getAllByRole(
    "listitem"
  );
  expect(alertListItems.length).toBe(1);
  [alertListItem] = alertListItems;
  within(alertListItem).getByText(usernameSelectionMessage);

  // Testing save on valid input; newly saved data loaded

  await waitFor(() => expect(screen.queryByRole("progressbar")).toBeNull());

  expect(emailTextBox).toHaveAttribute("readonly");
  expect(emailTextBox).toBeEnabled();
  expect(emailTextBox).toHaveDisplayValue(
    fullyRegisteredDiffUsername.resBody.email?.address!
  );
  expect(emailTextBox).toHaveAccessibleDescription(emailVerifiedHelperText);
  expect(emailTextBox).toBeValid();

  expect(usernameTextBox).toBeEnabled();
  expect(usernameTextBox).toHaveDisplayValue(
    fullyRegisteredDiffUsername.resBody.username
  );
  expect(usernameTextBox).toHaveAccessibleDescription();
  expect(usernameTextBox).toBeValid();
  expect(usernameTextBox).toBeRequired();

  expect(saveButton).toBeDisabled();

  expect(resetFormButton).toBeDisabled();

  await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
});

test("renders unregistered (unverified email) data loading, initial data loaded with info alert, saving data with info alert, saved data loaded with no alert", async () => {
  const user = userEvent.setup();

  server.use(unregisteredUnverifiedEmail.mswRestHandler);

  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <AccountEditor />
      </MemoryRouter>
    </QueryClientProvider>
  );

  // Testing form when data is initially loading

  screen.getByRole("progressbar");

  const emailTextBox = screen.getByRole("textbox", { name: emailLabel });
  expect(emailTextBox).toHaveAttribute("readonly");
  expect(emailTextBox).toBeDisabled();
  expect(emailTextBox).toHaveDisplayValue("");
  expect(emailTextBox).toHaveAccessibleDescription();
  expect(emailTextBox).toBeValid();

  const usernameTextBox = screen.getByRole("textbox", { name: usernameLabel });
  expect(usernameTextBox).toBeDisabled();
  expect(usernameTextBox).toHaveDisplayValue("");
  expect(usernameTextBox).toHaveAccessibleDescription();
  expect(usernameTextBox).toBeValid();
  expect(usernameTextBox).toBeRequired();

  const saveButton = screen.getByRole("button", { name: saveLabel });
  expect(saveButton).toBeDisabled();

  const resetFormButton = screen.getByRole("button", { name: resetFormLabel });
  expect(resetFormButton).toBeDisabled();

  expect(screen.queryByRole("alert")).toBeNull();

  // Testing form when initial data has loaded

  await waitFor(() => expect(screen.queryByRole("progressbar")).toBeNull());

  expect(emailTextBox).toHaveAttribute("readonly");
  expect(emailTextBox).toBeEnabled();
  expect(emailTextBox).toHaveDisplayValue(
    unregisteredNoUsername.resBody.email?.address!
  );
  expect(emailTextBox).toHaveAccessibleDescription(emailUnverifiedHelperText);
  expect(emailTextBox).toBeInvalid();

  expect(usernameTextBox).toBeEnabled();
  expect(usernameTextBox).toHaveDisplayValue(
    unregisteredUnverifiedEmail.resBody.username!
  );
  expect(usernameTextBox).toHaveAccessibleDescription();
  expect(usernameTextBox).toBeValid();
  expect(usernameTextBox).toBeRequired();

  expect(saveButton).toBeDisabled();

  expect(resetFormButton).toBeDisabled();

  let alert = screen.getByRole("alert");
  within(alert).getByText(alertTitle);
  let alertListItems = within(within(alert).getByRole("list")).getAllByRole(
    "listitem"
  );
  expect(alertListItems.length).toBe(1);
  let [alertListItem] = alertListItems;
  let emailVerificationMessageLink = within(alertListItem).getByRole("link");
  expect(emailVerificationMessageLink).toHaveAttribute(
    "href",
    emailVerificationMessageLinkTo
  );
  within(emailVerificationMessageLink).getByText(
    emailVerificationMessageLinkLabel
  );

  // Testing save on valid input

  const newUsername = unregisteredUnverifiedEmailDiffUsername.resBody.username;

  server.use(unregisteredUnverifiedEmailDiffUsername.mswRestHandler);

  await user.type(usernameTextBox, newUsername);
  await user.click(saveButton);

  // Testing save on valid input; loading newly saved data

  screen.getByRole("progressbar");
  expect(saveButton).toBeDisabled();
  expect(resetFormButton).toBeDisabled();
  expect(emailTextBox).toBeDisabled();
  expect(usernameTextBox).toBeDisabled();
  alert = screen.getByRole("alert");
  within(alert).getByText(alertTitle);
  alertListItems = within(within(alert).getByRole("list")).getAllByRole(
    "listitem"
  );
  expect(alertListItems.length).toBe(1);
  [alertListItem] = alertListItems;
  emailVerificationMessageLink = within(alertListItem).getByRole("link");
  expect(emailVerificationMessageLink).toHaveAttribute(
    "href",
    emailVerificationMessageLinkTo
  );
  within(emailVerificationMessageLink).getByText(
    emailVerificationMessageLinkLabel
  );

  // Testing save on valid input; newly saved data loaded

  await waitFor(() => expect(screen.queryByRole("progressbar")).toBeNull());

  expect(emailTextBox).toHaveAttribute("readonly");
  expect(emailTextBox).toBeEnabled();
  expect(emailTextBox).toHaveDisplayValue(
    unregisteredUnverifiedEmailDiffUsername.resBody.email?.address!
  );
  expect(emailTextBox).toHaveAccessibleDescription(emailUnverifiedHelperText);
  expect(emailTextBox).toBeInvalid();

  expect(usernameTextBox).toBeEnabled();
  expect(usernameTextBox).toHaveDisplayValue(
    unregisteredUnverifiedEmailDiffUsername.resBody.username
  );
  expect(usernameTextBox).toHaveAccessibleDescription();
  expect(usernameTextBox).toBeValid();
  expect(usernameTextBox).toBeRequired();

  expect(saveButton).toBeDisabled();

  expect(resetFormButton).toBeDisabled();

  alert = screen.getByRole("alert");
  within(alert).getByText(alertTitle);
  alertListItems = within(within(alert).getByRole("list")).getAllByRole(
    "listitem"
  );
  expect(alertListItems.length).toBe(1);
  [alertListItem] = alertListItems;
  emailVerificationMessageLink = within(alertListItem).getByRole("link");
  expect(emailVerificationMessageLink).toHaveAttribute(
    "href",
    emailVerificationMessageLinkTo
  );
  within(emailVerificationMessageLink).getByText(
    emailVerificationMessageLinkLabel
  );
});

test("renders unregistered (no username, unverified email) data loading, initial data loaded with info alert", async () => {
  server.use(unregisteredNoUsernameUnverifiedEmail.mswRestHandler);

  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <AccountEditor />
      </MemoryRouter>
    </QueryClientProvider>
  );

  // Testing form when data is initially loading

  screen.getByRole("progressbar");

  const emailTextBox = screen.getByRole("textbox", { name: emailLabel });
  expect(emailTextBox).toHaveAttribute("readonly");
  expect(emailTextBox).toBeDisabled();
  expect(emailTextBox).toHaveDisplayValue("");
  expect(emailTextBox).toHaveAccessibleDescription();
  expect(emailTextBox).toBeValid();

  const usernameTextBox = screen.getByRole("textbox", { name: usernameLabel });
  expect(usernameTextBox).toBeDisabled();
  expect(usernameTextBox).toHaveDisplayValue("");
  expect(usernameTextBox).toHaveAccessibleDescription();
  expect(usernameTextBox).toBeValid();
  expect(usernameTextBox).toBeRequired();

  const saveButton = screen.getByRole("button", { name: saveLabel });
  expect(saveButton).toBeDisabled();

  const resetFormButton = screen.getByRole("button", { name: resetFormLabel });
  expect(resetFormButton).toBeDisabled();

  expect(screen.queryByRole("alert")).toBeNull();

  // Testing form when initial data has loaded

  await waitFor(() => expect(screen.queryByRole("progressbar")).toBeNull());

  expect(emailTextBox).toHaveAttribute("readonly");
  expect(emailTextBox).toBeEnabled();
  expect(emailTextBox).toHaveDisplayValue(
    unregisteredNoUsernameUnverifiedEmail.resBody.email?.address!
  );
  expect(emailTextBox).toHaveAccessibleDescription(emailUnverifiedHelperText);
  expect(emailTextBox).toBeInvalid();

  expect(usernameTextBox).toBeEnabled();
  expect(usernameTextBox).toHaveDisplayValue("");
  expect(usernameTextBox).toHaveAccessibleDescription();
  expect(usernameTextBox).toBeInvalid();
  expect(usernameTextBox).toBeRequired();

  expect(saveButton).toBeDisabled();

  expect(resetFormButton).toBeDisabled();

  let alert = screen.getByRole("alert");
  within(alert).getByText(alertTitle);
  let alertListItems = within(within(alert).getByRole("list")).getAllByRole(
    "listitem"
  );
  expect(alertListItems.length).toBe(2);
  let [emailVerificationListItem, usernameListItem] = alertListItems;
  let emailVerificationMessageLink = within(
    emailVerificationListItem
  ).getByRole("link");
  expect(emailVerificationMessageLink).toHaveAttribute(
    "href",
    emailVerificationMessageLinkTo
  );
  within(emailVerificationMessageLink).getByText(
    emailVerificationMessageLinkLabel
  );
  within(usernameListItem).getByText(usernameSelectionMessage);
});

test("renders alert with bad request body", async () => {
  const user = userEvent.setup();

  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <AccountEditor />
      </MemoryRouter>
    </QueryClientProvider>
  );

  await waitFor(() => expect(screen.queryByRole("progressbar")).toBeNull());

  server.use(badRequest.mswRestHandler);

  await user.type(screen.getByRole("textbox", { name: usernameLabel }), "foo");
  await user.click(screen.getByRole("button", { name: saveLabel }));

  screen.getByRole("progressbar");

  await waitFor(() => expect(screen.queryByRole("progressbar")).toBeNull());

  within(screen.getByRole("alert")).getByText(badRequest.resBody);
});
