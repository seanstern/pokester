import Box from "@mui/material/Box";
import Chip, { ChipTypeMap } from "@mui/material/Chip";
import { FC } from "react";

export const label = "Position(s)";
export const dealerChipText = "D";
export const smallBlindChipText = "S";
export const bigBlindChipText = "B";

export enum BlindPosition {
  SMALL = "Small Blind",
  BIG = "Big Blind",
}

/**
 * Given a boolean indicating whether or or not the player is the dealer and an
 * optional blind position, returns the text of the chip to be displayed or
 * undefined when no chip text is displayed.
 *
 * @param dealer  a boolean indicating whether or or not the player is the
 *   dealer
 * @param blindPosition an optional blind position
 * @returns the text of the chip to be displayed
 */
export const getChipText = (dealer: boolean, blindPosition?: BlindPosition) =>
  dealer
    ? dealerChipText
    : blindPosition === BlindPosition.SMALL
    ? smallBlindChipText
    : blindPosition === BlindPosition.BIG
    ? bigBlindChipText
    : undefined;

type PositionsSectionProps = {
  blindPosition?: BlindPosition;
  chipColor?: ChipTypeMap["props"]["color"];
  dealer: boolean;
};
/**
 * Given props, return the positions (dealer, small blind, big blind) section
 * for a player.
 *
 * @param props
 * @param props.blindPosition an optional blind position for the player
 * @param props.chipColor the color of the chips used to represent the position
 * @param props.dealer a boolean indicating whether or not the player is the
 *   dealer
 * @returns the positions (dealer, small blind, big blind) section for a player.
 */
const PositionsSection: FC<PositionsSectionProps> = ({
  blindPosition,
  chipColor,
  dealer,
}) => {
  const showChip = !!dealer || !!blindPosition;
  return (
    <Box display="flex" component="section" aria-label={label}>
      {showChip && (
        <Chip
          size="small"
          label={getChipText(dealer, blindPosition)}
          color={chipColor}
        />
      )}
    </Box>
  );
};

export default PositionsSection;
