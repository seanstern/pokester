import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { PokerRooms } from "@pokester/common-api";
import { FC } from "react";
import PlayingCard from "../playing-card";
import cardToString from "../cardToString";

const communityCardsLabelId = "community-cards-id";
export const communityCardsRegionLabel = "Community Cards";

export type CommunityCardsProps = {
  communityCards: PokerRooms.Get.Card[];
};
/**
 * Given props, returns the community cards.
 *
 * @param props
 * @param props.communityCards An array of cards
 * @returns the community cards
 */
const CommunityCards: FC<CommunityCardsProps> = ({ communityCards }) => (
  <Box
    component="section"
    textAlign="center"
    aria-labelledby={communityCardsLabelId}
  >
    <Typography component="h2" variant="caption" id={communityCardsLabelId}>
      {communityCardsRegionLabel}
    </Typography>
    <Box display="flex" justifyContent="center" alignItems="center">
      {communityCards.map((cc, idx) => (
        <PlayingCard
          key={idx}
          value={cardToString(cc)}
          color={cc.color}
          size="lg"
        />
      ))}
    </Box>
  </Box>
);

export default CommunityCards;
