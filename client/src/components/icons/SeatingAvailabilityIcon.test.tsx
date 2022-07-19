import { render, screen } from "@testing-library/react";
import SeatingAvailabilityIcon, {
  SeatingAvailabilityDescription,
} from "./SeatingAvailabilityIcon";

test("renders appropriate icons when viewer is seated and cannot sit", () => {
  render(<SeatingAvailabilityIcon isSeated={true} canSit={false} />);

  // Accessibility tests
  screen.getByRole("img", {
    name: SeatingAvailabilityDescription.YOU_ARE_SEATED,
  });

  expect(
    screen.queryByRole("img", {
      name: SeatingAvailabilityDescription.EMPTY_SEAT,
    })
  ).toBeNull();

  expect(
    screen.queryByRole("img", {
      name: SeatingAvailabilityDescription.NO_EMPTY_SEATS,
    })
  ).toBeNull();

  // Image/styling tests
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

  // Accessibility tests
  screen.getByRole("img", {
    name: SeatingAvailabilityDescription.NO_EMPTY_SEATS,
  });

  expect(
    screen.queryByRole("img", {
      name: SeatingAvailabilityDescription.YOU_ARE_SEATED,
    })
  ).toBeNull();

  expect(
    screen.queryByRole("img", {
      name: SeatingAvailabilityDescription.EMPTY_SEAT,
    })
  ).toBeNull();

  // Image/styling tests
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

  // Accessibility tests
  screen.getByRole("img", {
    name: SeatingAvailabilityDescription.EMPTY_SEAT,
  });

  expect(
    screen.queryByRole("img", {
      name: SeatingAvailabilityDescription.YOU_ARE_SEATED,
    })
  ).toBeNull();

  expect(
    screen.queryByRole("img", {
      name: SeatingAvailabilityDescription.NO_EMPTY_SEATS,
    })
  ).toBeNull();

  const airlineSeatReclineNormalIcons = screen.getAllByTestId(
    "AirlineSeatReclineNormalIcon"
  );
  expect(airlineSeatReclineNormalIcons).toHaveLength(1);

  const tableRestaurantIcon = screen.getByTestId("TableRestaurantIcon");
  expect(tableRestaurantIcon).toBeInTheDocument();

  const eventSeatIcon = screen.queryByTestId("EventSeatIcon");
  expect(eventSeatIcon).toBeInTheDocument();
});
