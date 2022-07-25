import EventSeatIcon from "@mui/icons-material/EventSeat";
import React, { FC } from "react";
import NoEventSeatIcon from "../../icons/NoEventSeatIcon";
import BooleanQsToggle from "../../utils/BooleanQsToggle";

/**
 * Returns a toggle button group that controls the canSit query key value
 * in the query string component of the URL.
 *
 * @returns a toggle button group that controls the canSit query key value
 *   in the query string component of the URL.
 */
const SeatingAvailabilityQsToggle: FC = () => (
  <BooleanQsToggle
    qsKey="canSit"
    label="Seat Availability"
    labelIdPrefix="seat-availability"
    trueButton={{
      label: "Has open seat(s)",
      child: <EventSeatIcon />,
    }}
    falseButton={{
      label: "No open seat",
      child: <NoEventSeatIcon />,
    }}
  />
);

export default SeatingAvailabilityQsToggle;
