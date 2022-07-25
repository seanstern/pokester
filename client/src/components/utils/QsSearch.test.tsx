import { waitFor, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route } from "react-router-dom";
import QsSearch from "./QsSearch";

test("renders with empty text when initial query string contains no matching qsKey(s); correctly updates query string upon typing, clearing", async () => {
  const qsKey = "location";
  const label = "Location";

  const initialQs = "?someOtherQsKey=10001";
  const user = userEvent.setup();
  let qs = initialQs;
  render(
    <MemoryRouter initialEntries={[qs]}>
      <QsSearch qsKey={qsKey} label={label} />
      <Route
        path="*"
        render={({ location }) => {
          qs = location.search;
          return null;
        }}
      />
    </MemoryRouter>
  );

  expect(qs).toBe(initialQs);
  const qsSearch = screen.getByRole("searchbox", { name: label });

  const typedText = "New York, NY";
  await user.type(qsSearch, typedText);

  expect(screen.getByDisplayValue(typedText)).toBe(qsSearch);
  await waitFor(() =>
    expect(qs).toBe(`${initialQs}&${qsKey}=${encodeURIComponent(typedText)}`)
  );

  await user.clear(qsSearch);

  expect(screen.queryByDisplayValue(typedText)).toBe(null);
  expect(qs).toBe(initialQs);
});

test("renders with query string value when initial query string contains matching qsKey; correctly updates query string upon typing, clearing", async () => {
  const qsKey = "location";
  const label = "Location";

  const initialQsValue = "New York, NY";
  const initialQs = `?${qsKey}=${encodeURIComponent(initialQsValue)}`;
  const user = userEvent.setup();
  let qs = initialQs;
  render(
    <MemoryRouter initialEntries={[qs]}>
      <QsSearch qsKey={qsKey} label={label} />
      <Route
        path="*"
        render={({ location }) => {
          qs = location.search;
          return null;
        }}
      />
    </MemoryRouter>
  );

  expect(qs).toBe(initialQs);
  const qsSearch = screen.getByRole("searchbox", { name: label });
  expect(screen.getByDisplayValue(initialQsValue)).toBe(qsSearch);

  await user.clear(qsSearch);

  expect(screen.queryByDisplayValue(initialQsValue)).toBe(null);
  expect(qs).toBe("");

  const typedText = "Los Angeles, CA";
  await user.type(qsSearch, typedText);

  expect(screen.getByDisplayValue(typedText)).toBe(qsSearch);
  await waitFor(() =>
    expect(qs).toBe(`?${qsKey}=${encodeURIComponent(typedText)}`)
  );
});
