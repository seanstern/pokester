import { PokerRooms } from "@pokester/common-api";
import { render, screen, within } from "@testing-library/react";
import fromPairs from "lodash/fromPairs";
import toPairs from "lodash/toPairs";
import { getVisibleCardLabel } from "../playing-card";
import CommunityCards, { communityCardsRegionLabel } from "./CommunityCards";

const communityCardsFixtures = toPairs(
  fromPairs(
    Object.values(PokerRooms.Get.Fixtures.Table).map(
      ({ description, create }) => {
        const { communityCards } = create();
        const cardsDescription = communityCards
          .map(getVisibleCardLabel)
          .join(", ");
        return [
          `${cardsDescription ? "" : "no "}cards${
            cardsDescription ? `: ${cardsDescription}` : ""
          }`,
          () => communityCards,
        ];
      }
    )
  )
);

test.each(communityCardsFixtures)("renders with %s", (description, create) => {
  const communityCards = create();

  render(<CommunityCards communityCards={communityCards} />);

  const communityCardsRegion = screen.getByRole("region", {
    name: communityCardsRegionLabel,
  });
  within(communityCardsRegion).getByRole("heading", {
    level: 2,
    name: communityCardsRegionLabel,
  });
  communityCards.forEach((cc) =>
    within(communityCardsRegion).getByRole("generic", {
      name: getVisibleCardLabel(cc),
    })
  );
});
