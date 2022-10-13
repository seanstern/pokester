import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import Box from "@mui/material/Box";
import { SvgIconProps } from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip";
import React, { FC } from "react";
import { fontSize } from "./defaults";

/**
 * Returns an icon representing the table.
 *
 * @returns an icon representing the table.
 */
const TableIcon: FC = () => (
  <TableRestaurantIcon sx={{ paddingTop: 0.75 }} fontSize={fontSize} />
);

const defaultSeatedPlayerHorizontalMargin = -1.5;
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
const SeatedPlayerIcon: FC<SeatedPlayerIconProps> = ({ facing, color }) => {
  const sx =
    facing === "left"
      ? {
          marginLeft: defaultSeatedPlayerHorizontalMargin,
          transform: "scale(-1, 1)",
        }
      : { marginRight: defaultSeatedPlayerHorizontalMargin };
  const colorProps = color === undefined ? {} : { color };
  return (
    <AirlineSeatReclineNormalIcon
      fontSize={fontSize}
      sx={{ ...sx, paddingBottom: 0.75 }}
      {...colorProps}
    />
  );
};

const defaultEmptySeatHorizontalMargin = -0.75;
type EmptySeatIconProps = {
  tableTo: "left" | "right";
  color?: SvgIconProps["color"];
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
const EmptySeatIcon: FC<EmptySeatIconProps> = ({ tableTo, color }) => {
  const sx =
    tableTo === "left"
      ? { marginLeft: defaultEmptySeatHorizontalMargin }
      : { marginRight: defaultEmptySeatHorizontalMargin };
  const colorProps = color === undefined ? {} : { color };
  return (
    <EventSeatIcon
      fontSize={fontSize}
      sx={{ ...sx, paddingTop: 0.25, paddingBottom: 0.25 }}
      {...colorProps}
    />
  );
};

export enum SeatingAvailabilityDescription {
  YOU_ARE_SEATED = "You're seated",
  OPEN_SEAT = "Has an open seat for you",
  NO_OPEN_SEATS = "No open seats for you",
}

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
  const [viewerIcon, description] = isSeated
    ? [
        <SeatedPlayerIcon facing="right" color="primary" />,
        SeatingAvailabilityDescription.YOU_ARE_SEATED,
      ]
    : canSit
    ? [
        <EmptySeatIcon tableTo="right" color="primary" />,
        SeatingAvailabilityDescription.OPEN_SEAT,
      ]
    : [
        <Box color="text.secondary">
          <SeatedPlayerIcon facing="right" />
        </Box>,
        SeatingAvailabilityDescription.NO_OPEN_SEATS,
      ];
  return (
    <Tooltip title={description}>
      <Box role="img" display="flex">
        {viewerIcon}
        <Box color="text.secondary">
          <TableIcon />
          <SeatedPlayerIcon facing="left" />
        </Box>
      </Box>
    </Tooltip>
  );
};

export default SeatingAvailabilityIcon;
