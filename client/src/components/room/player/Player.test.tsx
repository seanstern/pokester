import { PokerRooms } from "@pokester/common-api";
import { render, screen, within } from "@testing-library/react";
import { getVisibleCardLabel, hiddenCardLabel } from "../playing-card";
import { positiveNumToCurrencyFormat as betOrWinningsToCurrency } from "./BetOrWinningsSection";
import { displayedCards, label as cardsLabel } from "./cards-section";
import Player, {
  displayBetOrWinningsSection,
  getBetOrWinningsLabel,
  hasWinnings,
  toToolTipText,
} from "./Player";
import {
  BlindPosition,
  getChipText,
  label as positionsLabel,
} from "./PositionsSection";
import {
  amountToCurrencyFormat as stackToCurrency,
  label as stackLabel,
} from "./StackSection";

const jestCasesTable = [
  { description: "non-dealer", props: { dealer: true } },
  { description: "dealer", props: { dealer: false } },
]
  .flatMap(({ description, props }) => [
    {
      description: `${description}, non-current-actor`,
      props: { ...props, currentActor: false },
    },
    {
      description: `${description}, current-actor`,
      props: { ...props, currentActor: true },
    },
  ])
  .flatMap(({ description, props }) => [
    {
      description: `${description}, non-round-in-progress`,
      props: { ...props, roundInProgress: false },
    },
    {
      description: `${description}, round-in-progress`,
      props: { ...props, roundInProgress: true },
    },
  ])
  .flatMap(({ description, props }) => [
    {
      description: `${description}, big blind`,
      props: { ...props, blindPosition: BlindPosition.BIG },
    },
    {
      description: `${description}, big blind`,
      props: { ...props, blindPosition: BlindPosition.SMALL },
    },
    {
      description: `${description}, no blind position`,
      props: { ...props, blindPosition: undefined },
    },
  ])
  .flatMap(({ description, props }) => [
    {
      description: `${description}, winnings present`,
      props: { ...props, winnings: 8675309.12 },
    },
    {
      description: `${description}, winnings absent`,
      props: { ...props, winnings: undefined },
    },
  ])
  .flatMap(({ description, props }) =>
    Object.values(PokerRooms.Get.Fixtures.Player).map((fixture) => ({
      description: `${description} player based on poker-engine-fixture: "${fixture.description}"`,
      create: () => ({ ...props, ...fixture.create() }),
    }))
  );

test.each(jestCasesTable)("renders $description", async ({ create }) => {
  const playerProps = create();
  const seatNumber = 0;
  const winner = hasWinnings(playerProps.winnings);

  render(<Player {...playerProps} seatNumber={seatNumber} />);

  const playerRegion = screen.getByRole("region", {
    name: playerProps.id,
    description: toToolTipText({ ...playerProps, winner }) || undefined,
  });

  within(playerRegion).getByRole("heading", {
    level: 2,
    name: playerProps.id,
  });

  const positionsRegion = within(playerRegion).getByRole("region", {
    name: positionsLabel,
  });
  const chipText = getChipText(playerProps.dealer, playerProps.blindPosition);
  if (chipText) {
    within(positionsRegion).getByText(chipText);
  }

  const stackRegion = within(playerRegion).getByRole("region", {
    name: stackLabel,
  });
  within(stackRegion).getByText(stackToCurrency(playerProps.stackSize));

  const cardsRegion = within(playerRegion).getByRole("region", {
    name: cardsLabel,
  });
  within(cardsRegion).getByRole("heading", {
    level: 3,
    name: cardsLabel,
  });
  const dCards = displayedCards({ ...playerProps, winner });
  for (const dc of dCards) {
    await within(cardsRegion).findAllByRole("generic", {
      name: dc ? getVisibleCardLabel(dc) : hiddenCardLabel,
    });
  }

  const betOrWinningsRegion = within(playerRegion).queryByRole("region", {
    name: getBetOrWinningsLabel(winner),
  });
  expect(betOrWinningsRegion).toEqual(
    displayBetOrWinningsSection(playerProps.roundInProgress, winner)
      ? expect.anything()
      : null
  );
  if (betOrWinningsRegion) {
    within(betOrWinningsRegion).getByRole("heading", {
      level: 3,
      name: getBetOrWinningsLabel(winner),
    });
    const amount = betOrWinningsToCurrency(
      winner ? playerProps.winnings! : playerProps.bet
    );
    if (amount) {
      within(betOrWinningsRegion).getByText(amount);
    }
  }
});
