import { Card, CardSuit, CardRank } from "@chevtek/poker-engine";
import { FixtureModule } from "../TypeUtils";

type CardSuitEntry = [string, CardSuit];
const cardSuits: CardSuitEntry[] = Object.entries(CardSuit);
type CardRankEntry = [string, CardRank];
const cardRanks: CardRankEntry[] = Object.entries(CardRank);
const allCardRankSuitEntryTuples = cardSuits.flatMap((cardSuitEntry) =>
  cardRanks.map(
    (cardRankEntry) =>
      [cardRankEntry, cardSuitEntry] as [CardRankEntry, CardSuitEntry]
  )
);

const cardFixtureModule: FixtureModule<Card> = allCardRankSuitEntryTuples.reduce(
  (cardsFixtureModule, [cardRankEntry, cardSuitEntry]) => {
    const [cardRankName, cardRankValue] = cardRankEntry;
    const camelCaseCardRankName = cardRankName.toLowerCase();
    const [cardSuitName, cardSuitValue] = cardSuitEntry;
    const camelCaseCardSuitName = `${cardSuitName
      .substring(0, 1)
      .toUpperCase()}${cardSuitName.substring(1).toLowerCase()}s`;
    const fixtureName = `${camelCaseCardRankName}Of${camelCaseCardSuitName}`;
    cardsFixtureModule[fixtureName] = {
      description: `${cardRankName.toLowerCase()} of ${cardSuitName.toLowerCase()}s`,
      create: () => new Card(cardRankValue, cardSuitValue),
    };
    return cardsFixtureModule;
  },
  {} as FixtureModule<Card>
);

export default cardFixtureModule;
