import EventSeatIcon from "@mui/icons-material/EventSeat";
import React, { FC } from "react";
import NoEventSeatIcon from "../../icons/NoEventSeatIcon";
import BooleanQsToggle from "../../utils/BooleanQsToggle";

export const label = "Seat Availability";
export const trueButtonLabel = "Has open seat(s)";
export const falseButtonLabel = "No open seat";
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
    label={label}
    labelIdPrefix="seat-availability"
    trueButton={{
      label: trueButtonLabel,
      child: <EventSeatIcon />,
    }}
    falseButton={{
      label: falseButtonLabel,
      child: <NoEventSeatIcon />,
    }}
  />
);

export default SeatingAvailabilityQsToggle;
