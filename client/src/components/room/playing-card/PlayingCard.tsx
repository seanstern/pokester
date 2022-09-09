import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { PokerRooms } from "@pokester/common-api";
import { FC } from "react";
import { CardString } from "../cardToString";

export type PlayingCardProps = Pick<PokerRooms.Get.Card, "color"> & {
  value: CardString;
};
/**
 * Given props, returns a playing card.
 *
 * @param props
 * @param props.color The color of the card
 * @param props.text The text of the card (rank followed by suit character)
 * @returns a playing card
 */
const PlayingCard: FC<PlayingCardProps> = ({ value, color }) => (
  <Paper sx={{ m: 0.25, px: 0.25, bgcolor: "white" }}>
    <Typography color={color} variant="body1">
      {value}
    </Typography>
  </Paper>
);

export default PlayingCard;
