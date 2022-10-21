import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { PokerRooms } from "@pokester/common-api";
import { FC, useRef } from "react";
import PlayingCard from "../playing-card";

const communityCardsLabelId = "community-cards-id";
export const communityCardsRegionLabel = "Community Cards";

type CommunityCardsProps = {
  communityCards: PokerRooms.Get.Card[];
};
/**
 * Given props, returns the community cards.
 *
 * @param props
 * @param props.communityCards An array of cards
 * @returns the community cards
 */
const CommunityCards: FC<CommunityCardsProps> = ({ communityCards }) => {
  const containerRef = useRef(null);
  return (
    <Box
      component="section"
      textAlign="center"
      aria-labelledby={communityCardsLabelId}
    >
      <Typography component="h2" variant="caption" id={communityCardsLabelId}>
        {communityCardsRegionLabel}
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
        ref={containerRef}
      >
        {communityCards.map((cc, idx) => (
          <PlayingCard
            key={idx}
            visible={cc}
            size="tall"
            containerRef={containerRef}
            dealt
          />
        ))}
      </Box>
    </Box>
  );
};

export default CommunityCards;
