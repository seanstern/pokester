import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import { SvgIconProps } from "@mui/material/SvgIcon";
import React, { FC } from "react";

const DEFAULT_FONT_SIZE = "large";
const DEFAULT_COLOR = "disabled";

/**
 * Returns an icon representing the table.
 *
 * @returns an icon representing the table.
 */
const TableIcon: FC = () => (
  <TableRestaurantIcon
    sx={{ paddingTop: 0.75 }}
    fontSize={DEFAULT_FONT_SIZE}
    color={DEFAULT_COLOR}
  />
);

const DEFAULT_SEATED_PLAYER_HORIZONTAL_MARGIN = -1.5;
type SeatedPlayerIconProps = {
  facing: "left" | "right";
  color?: SvgIconProps["color"];
};
/**
 * Given props, returns an icon representing a seated player.
 *
 * @param props
 * @param props.facing The direction the seated player is facing
 * @param props.color An optional color
 * @returns an icon representing a seated player
 */
const SeatedPlayerIcon: FC<SeatedPlayerIconProps> = ({
  facing,
  color: colorProp,
}) => {
  const sx =
    facing === "left"
      ? {
          marginLeft: DEFAULT_SEATED_PLAYER_HORIZONTAL_MARGIN,
          transform: "scale(-1, 1)",
        }
      : { marginRight: DEFAULT_SEATED_PLAYER_HORIZONTAL_MARGIN };
  const color = colorProp === undefined ? DEFAULT_COLOR : colorProp;
  return (
    <AirlineSeatReclineNormalIcon
      fontSize={DEFAULT_FONT_SIZE}
      sx={{ ...sx, paddingBottom: 0.75 }}
      color={color}
    />
  );
};

const DEFAULT_EMPTY_SEAT_HORIZONTAL_MARGIN = -0.75;
type EmptySeatIconProps = {
  tableTo: "left" | "right";
};
/**
 * Given props, returns an icon representing an empty seat (i.e. a seat
 * a player can sit in).
 *
 * @param props
 * @param props.tableTo The positioning of the table icon relative to this
 *   icon (i.e. "table to the left of the empty seat" or "table to the right
 *   of the empty seat")
 * @returns an icon representing an empty seat
 */
const EmptySeatIcon: FC<EmptySeatIconProps> = ({ tableTo }) => {
  const sx =
    tableTo === "left"
      ? { marginLeft: DEFAULT_EMPTY_SEAT_HORIZONTAL_MARGIN }
      : { marginRight: DEFAULT_EMPTY_SEAT_HORIZONTAL_MARGIN };
  return (
    <EventSeatIcon
      fontSize={DEFAULT_FONT_SIZE}
      sx={{ ...sx, paddingTop: 0.25, paddingBottom: 0.25 }}
    />
  );
};

type SeatingAvailabilityIconProps = {
  isSeated: boolean;
  canSit: boolean;
};
/**
 * Given props, returns an icon representing the seating availability of
 * a table.
 *
 * @param props
 * @param props.isSeated true when the viewer is seated, false otherwise
 * @param props.canSit true when the viewer can sit, false otherwise
 * @returns  an icon rpresenting the seating availability of a table
 */
const SeatingAvailabilityIcon: FC<SeatingAvailabilityIconProps> = ({
  isSeated,
  canSit,
}) => {
  const viewerIcon = isSeated ? (
    <SeatedPlayerIcon facing="right" color="inherit" />
  ) : canSit ? (
    <EmptySeatIcon tableTo="right" />
  ) : (
    <SeatedPlayerIcon facing="right" />
  );
  return (
    <>
      {viewerIcon}
      <TableIcon />
      <SeatedPlayerIcon facing="left" />
    </>
  );
};

export default SeatingAvailabilityIcon;
