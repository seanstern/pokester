import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FC } from "react";
import HoleCards, { HoleCardsProps } from "./HoleCards";

export const label = "Cards";

type CardsSectionProps = { seatNumber: number } & HoleCardsProps;
/**
 * Given props, returns the cards section of a player.
 *
 * @param props see {@linkcode HoleCardsProps} for fields not listed below
 * @param propw.seatNumber the seat in which the cards section appears
 * @returns the cards section of a player
 */
const CardsSection: FC<CardsSectionProps> = ({
  seatNumber,
  children,
  ...holeCardProps
}) => {
  const labelId = `player-cards-${seatNumber}`;
  return (
    <Box component="section" width={1} aria-labelledby={labelId}>
      <Typography component="h3" variant="caption" id={labelId}>
        {label}
      </Typography>
      <HoleCards {...holeCardProps} />
    </Box>
  );
};

export default CardsSection;
