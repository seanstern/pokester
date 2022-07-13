import { render, screen } from "@testing-library/react";
import SeatingAvailabilityIcon from "./SeatingAvailabilityIcon";

test("renders appropriate icons when viewer is seated and cannot sit", () => {
  render(<SeatingAvailabilityIcon isSeated={true} canSit={false} />);

  const airlineSeatReclineNormalIcons = screen.getAllByTestId(
    "AirlineSeatReclineNormalIcon"
  );
  expect(airlineSeatReclineNormalIcons).toHaveLength(2);

  const [computedStyle0, computedStyle1] = airlineSeatReclineNormalIcons.map(
    (icon) => getComputedStyle(icon)
  );
  expect(computedStyle0.color).not.toBe(computedStyle1.color);

  const tableRestaurantIcon = screen.getByTestId("TableRestaurantIcon");
  expect(tableRestaurantIcon).toBeInTheDocument();

  const eventSeatIcon = screen.queryByTestId("EventSeatIcon");
  expect(eventSeatIcon).toBeNull();
});

test("renders appropriate icons when viewer is not seated and cannot sit", () => {
  render(<SeatingAvailabilityIcon isSeated={false} canSit={false} />);

  const airlineSeatReclineNormalIcons = screen.getAllByTestId(
    "AirlineSeatReclineNormalIcon"
  );
  expect(airlineSeatReclineNormalIcons).toHaveLength(2);

  const [computedStyle0, computedStyle1] = airlineSeatReclineNormalIcons.map(
    (icon) => getComputedStyle(icon)
  );
  expect(computedStyle0.color).toBe(computedStyle1.color);

  const tableRestaurantIcon = screen.getByTestId("TableRestaurantIcon");
  expect(tableRestaurantIcon).toBeInTheDocument();

  const eventSeatIcon = screen.queryByTestId("EventSeatIcon");
  expect(eventSeatIcon).toBeNull();
});

test("renders appropriate icons when viewer is not seated and can sit", () => {
  render(<SeatingAvailabilityIcon isSeated={false} canSit={true} />);

  const airlineSeatReclineNormalIcons = screen.getAllByTestId(
    "AirlineSeatReclineNormalIcon"
  );
  expect(airlineSeatReclineNormalIcons).toHaveLength(1);

  const tableRestaurantIcon = screen.getByTestId("TableRestaurantIcon");
  expect(tableRestaurantIcon).toBeInTheDocument();

  const eventSeatIcon = screen.queryByTestId("EventSeatIcon");
  expect(eventSeatIcon).toBeInTheDocument();
});
