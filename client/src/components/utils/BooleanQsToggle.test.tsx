import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import BooleanQsToggle from "./BooleanQsToggle";

test("renders with neither toggle button pressed when initial query string contains no matching qsKey(s); correctly toggles on clicks of each button", () => {
  const qsKey = "paidGames";
  const label = "Price Filter";
  const labelIdPrefix = "price-filter";
  const trueButton = {
    label: "Paid only",
    child: <>Paid</>,
  };
  const falseButton = {
    label: "Free only",
    child: <>Free</>,
  };
  const initialSearch = "?someOtherQsKey=true";
  let search = initialSearch;
  render(
    <MemoryRouter initialEntries={[search]}>
      <BooleanQsToggle
        qsKey={qsKey}
        label={label}
        labelIdPrefix={labelIdPrefix}
        trueButton={trueButton}
        falseButton={falseButton}
      />
      <Route
        path="*"
        render={({ location }) => {
          search = location.search;
          return null;
        }}
      />
    </MemoryRouter>
  );

  expect(search).toBe(initialSearch);
  screen.getByRole("heading", { name: label, level: 3 });
  screen.getByRole("group", { name: label });
  const trueButtonEl = screen.getByRole("button", {
    name: trueButton.label,
    pressed: false,
  });
  const falseButtonEl = screen.getByRole("button", {
    name: falseButton.label,
    pressed: false,
  });

  fireEvent.click(trueButtonEl);

  expect(search).toBe(`?someOtherQsKey=true&${qsKey}=true`);
  screen.getByRole("button", { name: trueButton.label, pressed: true });
  screen.getByRole("button", { name: falseButton.label, pressed: false });

  fireEvent.click(falseButtonEl);

  expect(search).toBe(`?someOtherQsKey=true&${qsKey}=false`);
  screen.getByRole("button", { name: trueButton.label, pressed: false });
  screen.getByRole("button", { name: falseButton.label, pressed: true });

  fireEvent.click(falseButtonEl);

  expect(search).toBe(`?someOtherQsKey=true`);
  screen.getByRole("button", { name: trueButton.label, pressed: false });
  screen.getByRole("button", { name: falseButton.label, pressed: false });
});

test("renders with true toggle button pressed when initial query string contains [qsKey]=true; correctly toggles on clicks of each button", () => {
  const qsKey = "paidGames";
  const initQsValue = "true";
  const label = "Price Filter";
  const labelIdPrefix = "price-filter";
  const trueButton = {
    label: "Paid only",
    child: <>Paid</>,
  };
  const falseButton = {
    label: "Free only",
    child: <>Free</>,
  };
  const initialSearch = `?${qsKey}=${initQsValue}`;
  let search = initialSearch;
  render(
    <MemoryRouter initialEntries={[search]}>
      <BooleanQsToggle
        qsKey={qsKey}
        label={label}
        labelIdPrefix={labelIdPrefix}
        trueButton={trueButton}
        falseButton={falseButton}
      />
      <Route
        path="*"
        render={({ location }) => {
          search = location.search;
          return null;
        }}
      />
    </MemoryRouter>
  );

  expect(search).toBe(initialSearch);
  screen.getByRole("heading", { name: label, level: 3 });
  screen.getByRole("group", { name: label });
  const trueButtonEl = screen.getByRole("button", {
    name: trueButton.label,
    pressed: true,
  });
  const falseButtonEl = screen.getByRole("button", {
    name: falseButton.label,
    pressed: false,
  });

  fireEvent.click(trueButtonEl);

  expect(search).toBe("");
  screen.getByRole("button", { name: trueButton.label, pressed: false });
  screen.getByRole("button", { name: falseButton.label, pressed: false });

  fireEvent.click(falseButtonEl);

  expect(search).toBe(`?${qsKey}=false`);
  screen.getByRole("button", { name: trueButton.label, pressed: false });
  screen.getByRole("button", { name: falseButton.label, pressed: true });

  fireEvent.click(falseButtonEl);

  expect(search).toBe("");
  screen.getByRole("button", { name: trueButton.label, pressed: false });
  screen.getByRole("button", { name: falseButton.label, pressed: false });
});

test("renders with false toggle button pressed when initial query string contains [qsKey]=true", () => {
  const qsKey = "paidGames";
  const initQsValue = "false";
  const label = "Price Filter";
  const labelIdPrefix = "price-filter";
  const trueButton = {
    label: "Paid only",
    child: <>Paid</>,
  };
  const falseButton = {
    label: "Free only",
    child: <>Free</>,
  };
  const initialSearch = `?${qsKey}=${initQsValue}`;
  let search = initialSearch;
  render(
    <MemoryRouter initialEntries={[search]}>
      <BooleanQsToggle
        qsKey={qsKey}
        label={label}
        labelIdPrefix={labelIdPrefix}
        trueButton={trueButton}
        falseButton={falseButton}
      />
      <Route
        path="*"
        render={({ location }) => {
          search = location.search;
          return null;
        }}
      />
    </MemoryRouter>
  );

  expect(search).toBe(initialSearch);
  screen.getByRole("heading", { name: label, level: 3 });
  screen.getByRole("group", { name: label });
  const trueButtonEl = screen.getByRole("button", {
    name: trueButton.label,
    pressed: false,
  });
  const falseButtonEl = screen.getByRole("button", {
    name: falseButton.label,
    pressed: true,
  });

  fireEvent.click(trueButtonEl);

  expect(search).toBe(`?${qsKey}=true`);
  screen.getByRole("button", { name: trueButton.label, pressed: true });
  screen.getByRole("button", { name: falseButton.label, pressed: false });

  fireEvent.click(falseButtonEl);

  expect(search).toBe(`?${qsKey}=false`);
  screen.getByRole("button", { name: trueButton.label, pressed: false });
  screen.getByRole("button", { name: falseButton.label, pressed: true });

  fireEvent.click(falseButtonEl);

  expect(search).toBe("");
  screen.getByRole("button", { name: trueButton.label, pressed: false });
  screen.getByRole("button", { name: falseButton.label, pressed: false });
});
