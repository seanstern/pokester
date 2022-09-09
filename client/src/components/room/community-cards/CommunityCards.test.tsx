import { render, screen, within } from "@testing-library/react";
import CommunityCards, { communityCardsRegionLabel } from "./CommunityCards";
import { PokerRooms } from "@pokester/common-api";
import cardToString from "../cardToString";
import fromPairs from "lodash/fromPairs";
import toPairs from "lodash/toPairs";

const communityCardsFixtures = toPairs(
  fromPairs(
    Object.values(PokerRooms.Get.Fixtures.Table).map(
      ({ description, create }) => {
        const { communityCards } = create();
        const cardsDescription = communityCards.map(cardToString).join(", ");
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
    within(communityCardsRegion).getByText(cardToString(cc))
  );
});
