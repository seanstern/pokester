import { render, screen } from "@testing-library/react";
import { deck as createDeck } from "../../../card-utils";
import { getVisibleCardLabel, hiddenCardLabel } from "../../playing-card";
import HoleCards, { displayedCards } from "./HoleCards";

const deck = createDeck();
const definedHoleCards = [deck[0], deck[deck.length - 1]] as [
  typeof deck[0],
  typeof deck[0]
];

const cases = [
  {
    description: "hole cards present",
    props: { holeCards: definedHoleCards },
  },
  { description: "hole cards absent", props: { holeCards: undefined } },
]
  .flatMap(({ description, props }) => [
    {
      description: `${description}, round not in progress`,
      props: { ...props, roundInProgress: false },
    },
    {
      description: `${description}, round in progress`,
      props: { ...props, roundInProgress: true },
    },
  ])
  .flatMap(({ description, props }) => [
    {
      description: `${description}, not winner`,
      props: { ...props, winner: false },
    },
    {
      description: `${description}, winner`,
      props: { ...props, winner: true },
    },
  ])
  .flatMap(({ description, props }) => [
    {
      description: `${description}, folded`,
      props: { ...props, folded: true },
    },
    {
      description: `${description}, not folded`,
      props: { ...props, folded: false },
    },
  ]);

test.each(cases)(`renders $description`, async ({ props }) => {
  // eslint-disable-next-line testing-library/no-unnecessary-act
  // await act(async () => {
  render(<HoleCards {...props} />);
  // });

  const dispCards = displayedCards(props);

  for (const dc of dispCards) {
    await screen.findAllByRole("generic", {
      name: dc ? getVisibleCardLabel(dc) : hiddenCardLabel,
    });
  }
});
