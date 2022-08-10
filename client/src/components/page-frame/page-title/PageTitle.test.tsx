import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FC, useState } from "react";
import { MemoryRouter } from "react-router-dom";
import { flatNavConfig } from "../navigation";
import { PageTitleProvider, usePageTitle, useSetPageTitle } from "./PageTitle";

// Wrapper for usePageTitle
const PageTitleConsumer: FC = () => {
  const pageTitle = usePageTitle();
  return <>{pageTitle}</>;
};

// Wrapper for setPageTitle
const PageTitleSetter: FC<{ title: string }> = ({ title }) => {
  useSetPageTitle(title);
  return null;
};

const toggleLabel = "Toggle";
const toggleRole = "button";
// Wrapper that allows useSetPageTitle hook to be toggled in and out of the
// render tree. Useful for testing if the pageTitle provided reverts back
// to navTitle bases when useSetPageTitle hook isn't part of tree.
const TogglePageTitleSetter: FC<{ title: string }> = ({ title }) => {
  const [isSetterOn, setIsSetterOn] = useState(true);
  const pts = isSetterOn ? <PageTitleSetter title={title} /> : null;
  return (
    <>
      {pts}
      <button onClick={() => setIsSetterOn((isSetterOn) => !isSetterOn)}>
        {toggleLabel}
      </button>
    </>
  );
};

describe("PageTitleProvider provides nav based title when no page title explicitly set", () => {
  test.each(flatNavConfig)("$path provides $title", async ({ path, title }) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <PageTitleProvider>
          <PageTitleConsumer />
        </PageTitleProvider>
      </MemoryRouter>
    );

    screen.getByText(title);
  });
});

describe("PageTitleProvider provides overridden title when title explicitly set, reverts to nav based title when not", () => {
  const overrideTitle = "Override Title";
  test.each(flatNavConfig)(
    `$path provides ${overrideTitle} when explicitly set`,
    async ({ path, title: navTitle }) => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={[path]}>
          <PageTitleProvider>
            <PageTitleConsumer />
            <TogglePageTitleSetter title={overrideTitle} />
          </PageTitleProvider>
        </MemoryRouter>
      );

      screen.getByText(overrideTitle);

      const toggleButton = screen.getByRole(toggleRole, { name: toggleLabel });

      await user.click(toggleButton);

      expect(screen.queryByText(overrideTitle)).toBeNull();

      screen.getByText(navTitle);
    }
  );
});
