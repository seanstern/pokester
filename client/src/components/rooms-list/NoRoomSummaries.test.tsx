import { render, screen } from "@testing-library/react";
import NoRoomSummaries, { defaultText } from "./NoRoomSummaries";

test("renders component with default text", async () => {
  render(<NoRoomSummaries />);

  screen.getByRole("heading", { level: 2, name: defaultText });
});
