import {
  emptyPot,
  potWithEligiblePlayersNoWinners,
  potWithWinners,
} from "../../__fixtures__/poker-engine/Pot.fixture";
import viewOfPot from "./ViewOfPot";

describe("viewOfPot produces valid JSON when given", () => {
  test(emptyPot.description, () => {
    const view = viewOfPot("anyId", emptyPot.create());
    expect(view.eligiblePlayers).toStrictEqual([]);
    expect(view.winners).toBeUndefined();
    expect(view).toMatchInlineSnapshot(`
      Object {
        "amount": 0,
        "eligiblePlayers": Array [],
        "winners": undefined,
      }
    `);
  });

  describe(potWithEligiblePlayersNoWinners.description, () => {
    test("and viewerId in eligiblePlayers", () => {
      const pot = potWithEligiblePlayersNoWinners.create();
      if (pot.eligiblePlayers.length < 1) {
        throw new Error("eligiblePlayers is empty");
      }
      const { id: viewierId } = pot.eligiblePlayers[0];
      const view = viewOfPot(viewierId, pot);
      expect(view.winners).toBeUndefined();
      // Expectations of veiw.eligiblePlayers are implicitly
      // checked by inline snapshot below (as opposed to
      // explicit expect(view.elibiblePlayers).[EXPECTATION]
      // because view.eligiblePlayers is defined by viewOfPlayer
      // function, which is explicitly tsted in viewOfPlayer.test.ts
      expect(view).toMatchInlineSnapshot(`
        Object {
          "amount": 40,
          "eligiblePlayers": Array [
            Object {
              "bet": 0,
              "folded": false,
              "handDescr": "Flush, Qs High",
              "holeCards": Array [
                Object {
                  "color": "#000000",
                  "rank": "2",
                  "suit": "s",
                  "suitChar": "♠",
                },
                Object {
                  "color": "#000000",
                  "rank": "3",
                  "suit": "s",
                  "suitChar": "♠",
                },
              ],
              "id": "Jane",
              "isSelf": true,
              "left": false,
              "legalActions": Array [
                "stand",
              ],
              "stackSize": 2990,
            },
            Object {
              "bet": 0,
              "folded": false,
              "handDescr": undefined,
              "holeCards": undefined,
              "id": "Juan",
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
              "stackSize": 9189,
            },
            Object {
              "bet": 0,
              "folded": false,
              "handDescr": undefined,
              "holeCards": undefined,
              "id": "John",
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
              "stackSize": 1990,
            },
            Object {
              "bet": 0,
              "folded": false,
              "handDescr": undefined,
              "holeCards": undefined,
              "id": "Jay",
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
              "stackSize": 31405,
            },
          ],
          "winners": undefined,
        }
      `);
    });

    test("and viewerId not in eligiblePlayers", () => {
      const pot = potWithEligiblePlayersNoWinners.create();
      const nonEligiblePlayerId = "nonEligiblePlayerIdValue";
      if (
        pot.eligiblePlayers.find(
          ({ id: eligiblePlayerId }) => nonEligiblePlayerId === eligiblePlayerId
        )
      ) {
        throw new Error(`${nonEligiblePlayerId} is id in pot.eligiblePlayers`);
      }
      const view = viewOfPot(nonEligiblePlayerId, pot);
      expect(view.winners).toBeUndefined();
      // Expectations of veiw.eligiblePlayers are implicitly
      // checked by inline snapshot below (as opposed to
      // explicit expect(view.elibiblePlayers).[EXPECTATION]
      // because view.eligiblePlayers is defined by viewOfPlayer
      // function, which is explicitly tsted in viewOfPlayer.test.ts
      expect(view).toMatchInlineSnapshot(`
        Object {
          "amount": 40,
          "eligiblePlayers": Array [
            Object {
              "bet": 0,
              "folded": false,
              "handDescr": undefined,
              "holeCards": undefined,
              "id": "Jane",
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
              "stackSize": 2990,
            },
            Object {
              "bet": 0,
              "folded": false,
              "handDescr": undefined,
              "holeCards": undefined,
              "id": "Juan",
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
              "stackSize": 9189,
            },
            Object {
              "bet": 0,
              "folded": false,
              "handDescr": undefined,
              "holeCards": undefined,
              "id": "John",
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
              "stackSize": 1990,
            },
            Object {
              "bet": 0,
              "folded": false,
              "handDescr": undefined,
              "holeCards": undefined,
              "id": "Jay",
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
              "stackSize": 31405,
            },
          ],
          "winners": undefined,
        }
      `);
    });
  });

  describe(potWithWinners.description, () => {
    test("and viewerId in winners", () => {
      const pot = potWithWinners.create();
      const { id: viewierId } = pot.winners[0];
      const view = viewOfPot(viewierId, pot);
      expect(view.winners).toBeDefined();
      // Expectations of veiw.winners are implicitly
      // checked by inline snapshot below (as opposed to
      // explicit expect(view.winners).[EXPECTATION]
      // because view.winners is defined by viewOfPlayer
      // function, which is explicitly tsted in viewOfPlayer.test.ts
      expect(view).toMatchInlineSnapshot(`
        Object {
          "amount": 340,
          "eligiblePlayers": Array [
            Object {
              "bet": 0,
              "folded": false,
              "handDescr": "Royal Flush",
              "holeCards": Array [
                Object {
                  "color": "#000000",
                  "rank": "4",
                  "suit": "s",
                  "suitChar": "♠",
                },
                Object {
                  "color": "#000000",
                  "rank": "5",
                  "suit": "s",
                  "suitChar": "♠",
                },
              ],
              "id": "Juan",
              "isSelf": true,
              "left": false,
              "legalActions": Array [
                "stand",
                "deal",
              ],
              "stackSize": 9209,
            },
            Object {
              "bet": 0,
              "folded": false,
              "handDescr": "Royal Flush",
              "holeCards": Array [
                Object {
                  "color": "#000000",
                  "rank": "8",
                  "suit": "s",
                  "suitChar": "♠",
                },
                Object {
                  "color": "#000000",
                  "rank": "9",
                  "suit": "s",
                  "suitChar": "♠",
                },
              ],
              "id": "Jay",
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
              "stackSize": 31425,
            },
          ],
          "winners": Array [
            Object {
              "bet": 0,
              "folded": false,
              "handDescr": "Royal Flush",
              "holeCards": Array [
                Object {
                  "color": "#000000",
                  "rank": "4",
                  "suit": "s",
                  "suitChar": "♠",
                },
                Object {
                  "color": "#000000",
                  "rank": "5",
                  "suit": "s",
                  "suitChar": "♠",
                },
              ],
              "id": "Juan",
              "isSelf": true,
              "left": false,
              "legalActions": Array [
                "stand",
                "deal",
              ],
              "stackSize": 9209,
            },
            Object {
              "bet": 0,
              "folded": false,
              "handDescr": "Royal Flush",
              "holeCards": Array [
                Object {
                  "color": "#000000",
                  "rank": "8",
                  "suit": "s",
                  "suitChar": "♠",
                },
                Object {
                  "color": "#000000",
                  "rank": "9",
                  "suit": "s",
                  "suitChar": "♠",
                },
              ],
              "id": "Jay",
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
              "stackSize": 31425,
            },
          ],
        }
      `);
    });

    test("and viewerId not in winners", () => {
      const pot = potWithWinners.create();
      const nonWinnerPlayerId = "nonWinnerPlayerIdValue";
      if (
        pot.winners.find(
          ({ id: winnerPlayerId }) => nonWinnerPlayerId === winnerPlayerId
        )
      ) {
        throw new Error(`${nonWinnerPlayerId} is id in pot.winners`);
      }
      const view = viewOfPot(nonWinnerPlayerId, pot);
      expect(view.winners).toBeDefined();
      // Expectations of veiw.winners are implicitly
      // checked by inline snapshot below (as opposed to
      // explicit expect(view.winners).[EXPECTATION]
      // because view.winners is defined by viewOfPlayer
      // function, which is explicitly tsted in viewOfPlayer.test.ts
      expect(view).toMatchInlineSnapshot(`
        Object {
          "amount": 340,
          "eligiblePlayers": Array [
            Object {
              "bet": 0,
              "folded": false,
              "handDescr": "Royal Flush",
              "holeCards": Array [
                Object {
                  "color": "#000000",
                  "rank": "4",
                  "suit": "s",
                  "suitChar": "♠",
                },
                Object {
                  "color": "#000000",
                  "rank": "5",
                  "suit": "s",
                  "suitChar": "♠",
                },
              ],
              "id": "Juan",
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
              "stackSize": 9209,
            },
            Object {
              "bet": 0,
              "folded": false,
              "handDescr": "Royal Flush",
              "holeCards": Array [
                Object {
                  "color": "#000000",
                  "rank": "8",
                  "suit": "s",
                  "suitChar": "♠",
                },
                Object {
                  "color": "#000000",
                  "rank": "9",
                  "suit": "s",
                  "suitChar": "♠",
                },
              ],
              "id": "Jay",
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
              "stackSize": 31425,
            },
          ],
          "winners": Array [
            Object {
              "bet": 0,
              "folded": false,
              "handDescr": "Royal Flush",
              "holeCards": Array [
                Object {
                  "color": "#000000",
                  "rank": "4",
                  "suit": "s",
                  "suitChar": "♠",
                },
                Object {
                  "color": "#000000",
                  "rank": "5",
                  "suit": "s",
                  "suitChar": "♠",
                },
              ],
              "id": "Juan",
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
              "stackSize": 9209,
            },
            Object {
              "bet": 0,
              "folded": false,
              "handDescr": "Royal Flush",
              "holeCards": Array [
                Object {
                  "color": "#000000",
                  "rank": "8",
                  "suit": "s",
                  "suitChar": "♠",
                },
                Object {
                  "color": "#000000",
                  "rank": "9",
                  "suit": "s",
                  "suitChar": "♠",
                },
              ],
              "id": "Jay",
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
              "stackSize": 31425,
            },
          ],
        }
      `);
    });
  });
});
