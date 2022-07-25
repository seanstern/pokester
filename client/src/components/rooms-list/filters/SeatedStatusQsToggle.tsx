import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import React, { FC } from "react";
import NoAirlineSeatReclineNormalIcon from "../../icons/NoAirlineSeatReclineNormalIcon";
import BooleanQsToggle from "../../utils/BooleanQsToggle";

export const label = "Your Status";
export const trueButtonLabel = "You're seated";
export const falseButtonLabel = "You're not seated";
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
    label={label}
    labelIdPrefix="seated-status"
    trueButton={{
      label: trueButtonLabel,
      child: <AirlineSeatReclineNormalIcon />,
    }}
    falseButton={{
      label: falseButtonLabel,
      child: <NoAirlineSeatReclineNormalIcon />,
    }}
  />
);

export default SeatedStatusQsToggle;
