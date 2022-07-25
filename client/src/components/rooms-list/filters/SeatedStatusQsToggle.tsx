import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import React, { FC } from "react";
import NoAirlineSeatReclineNormalIcon from "../../icons/NoAirlineSeatReclineNormalIcon";
import BooleanQsToggle from "../../utils/BooleanQsToggle";

/**
 * Returns a toggle button group that controls the isSeated query key value
 * in the query string component of the URL.
 *
 * @returns a toggle button group that controls the isSeated query key value
 *   in the query string component of the URL.
 */
const SeatedStatusQsToggle: FC = () => (
  <BooleanQsToggle
    qsKey="isSeated"
    label="Your Status"
    labelIdPrefix="seated-status"
    trueButton={{
      label: "You're seated",
      child: <AirlineSeatReclineNormalIcon />,
    }}
    falseButton={{
      label: "You're not seated",
      child: <NoAirlineSeatReclineNormalIcon />,
    }}
  />
);

export default SeatedStatusQsToggle;
