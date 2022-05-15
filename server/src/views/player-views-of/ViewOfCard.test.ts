import CardFixtures from "../../__fixtures__/poker-engine/Card.fixture";
import { asJestCasesTable } from "../../__fixtures__/TestCaseUtils";
import viewOfCard from "./ViewOfCard";

const cardCases = asJestCasesTable(CardFixtures);

describe("viewOfCard produces valid JSON when given Card", () => {
  test.each(cardCases)("$description", ({ create }) => {
    expect(viewOfCard(create())).toMatchSnapshot();
  });
});
