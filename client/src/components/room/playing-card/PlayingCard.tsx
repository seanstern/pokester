import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { PokerRooms } from "@pokester/common-api";
import { FC } from "react";
import { CardString } from "../cardToString";

export type PlayingCardProps = Pick<PokerRooms.Get.Card, "color"> & {
  value: CardString;
  size?: "sm" | "lg";
};
/**
 * Given props, returns a playing card.
 *
 * @param props
 * @param props.color The color of the card
 * @param props.value The text of the card (rank followed by suit character)
 * @param props.size Optional size of the card's font--either "sm" or "lg"
 * @returns a playing card
 */
const PlayingCard: FC<PlayingCardProps> = ({ value, color, size }) => (
  <Paper sx={{ m: 0.25, px: 0.25, bgcolor: "white" }}>
    <Typography
      color={color}
      component="p"
      variant={size === "lg" ? "h6" : "body1"}
    >
      {value}
    </Typography>
  </Paper>
);

export default PlayingCard;
