import { render, screen } from "@testing-library/react";
import LoadingProgress, { defaultAriaLabel } from "./LoadingProgress";

test("renders component with default label when isLoading true", async () => {
  render(<LoadingProgress show={true} />);

  screen.getByRole("progressbar", { name: defaultAriaLabel });
});

test("renders with custom label when isLoading true", async () => {
  const ariaLoadingObjectLabel = "things";
  render(
    <LoadingProgress
      show={true}
      ariaLoadingObjectLabel={ariaLoadingObjectLabel}
    />
  );

  screen.getByRole("progressbar", {
    name: `${defaultAriaLabel} ${ariaLoadingObjectLabel}`,
  });
});

test("renders nothing when isLoading false; default label used", async () => {
  render(<LoadingProgress show={false} />);

  expect(
    screen.queryByRole("progressbar", { name: defaultAriaLabel })
  ).toBeNull();
});

test("renders nothing when isLoading false; custom label used", async () => {
  const ariaLoadingObjectLabel = "things";

  render(
    <LoadingProgress
      show={false}
      ariaLoadingObjectLabel={ariaLoadingObjectLabel}
    />
  );

  expect(
    screen.queryByRole("progressbar", {
      name: `${defaultAriaLabel} ${ariaLoadingObjectLabel}`,
    })
  ).toBeNull();
});
