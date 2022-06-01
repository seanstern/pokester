import {
  emptyTable,
  playersSeated,
  preFlop,
  flop,
  turn,
  river,
  completeRound,
  roundTwo,
} from "../../__fixtures__/poker-engine/Table.fixture";
import { asJestCasesTable } from "../../__fixtures__/TestCaseUtils";
import viewOfTable from "./ViewOfTable";

describe("viewOfTable produces valid JSON when given", () => {
  test(emptyTable.description, () => {
    const table = emptyTable.create();
    const view = viewOfTable("anyId", table);
    expect(view).toMatchInlineSnapshot(`
      Object {
        "bigBlind": 10,
        "bigBlindPosition": undefined,
        "buyIn": 1000,
        "communityCards": Array [],
        "currentBet": undefined,
        "currentPosition": undefined,
        "currentRound": undefined,
        "dealerPosition": undefined,
        "handNumber": 0,
        "players": Array [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        "pots": Array [],
        "smallBlind": 5,
        "smallBlindPosition": undefined,
        "winners": undefined,
      }
    `);
  });

  const tableCases = asJestCasesTable({
    playersSeated,
    preFlop,
    flop,
    turn,
    river,
    roundTwo,
  });
  describe.each(tableCases)("$description", ({ create }) => {
    const table = create();
    test("and viewerId in players", () => {
      const { id: viewerId } = table.players.find((player) => player !== null)!;
      const view = viewOfTable(viewerId, table);
      expect(view).toMatchSnapshot();
    });

    test("and viewerId not in players", () => {
      const nonPlayerId = "nonPlayerIdValue";
      if (!!table.players.find((player) => nonPlayerId === player?.id)) {
        throw new Error(`${nonPlayerId} is id in table.players`);
      }
      const view = viewOfTable(nonPlayerId, table);
      expect(view).toMatchSnapshot();
    });
  });

  describe(completeRound.description, () => {
    const table = completeRound.create();
    test("and viewerId in winners", () => {
      const { id: viewerId } = table.winners![0];
      const view = viewOfTable(viewerId, table);
      expect(view).toMatchInlineSnapshot(`
        Object {
          "bigBlind": 10,
          "bigBlindPosition": 0,
          "buyIn": 1000,
          "communityCards": Array [
            Object {
              "color": "#000000",
              "rank": "T",
              "suit": "s",
              "suitChar": "♠",
            },
            Object {
              "color": "#000000",
              "rank": "J",
              "suit": "s",
              "suitChar": "♠",
            },
            Object {
              "color": "#000000",
              "rank": "Q",
              "suit": "s",
              "suitChar": "♠",
            },
            Object {
              "color": "#000000",
              "rank": "K",
              "suit": "s",
              "suitChar": "♠",
            },
            Object {
              "color": "#000000",
              "rank": "A",
              "suit": "s",
              "suitChar": "♠",
            },
          ],
          "currentBet": undefined,
          "currentPosition": undefined,
          "currentRound": undefined,
          "dealerPosition": 3,
          "handNumber": 1,
          "players": Array [
            Object {
              "bet": 0,
              "folded": false,
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
              "legalActions": undefined,
              "stackSize": 3010,
            },
            Object {
              "bet": 0,
              "folded": true,
              "holeCards": undefined,
              "id": "Juan",
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
              "stackSize": 9189,
            },
            null,
            Object {
              "bet": 0,
              "folded": false,
              "holeCards": Array [
                Object {
                  "color": "#000000",
                  "rank": "6",
                  "suit": "s",
                  "suitChar": "♠",
                },
                Object {
                  "color": "#000000",
                  "rank": "7",
                  "suit": "s",
                  "suitChar": "♠",
                },
              ],
              "id": "John",
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
              "stackSize": 2010,
            },
            null,
            null,
            null,
            Object {
              "bet": 0,
              "folded": true,
              "holeCards": undefined,
              "id": "Jay",
              "isSelf": false,
              "left": true,
              "legalActions": undefined,
              "stackSize": 31405,
            },
            null,
            null,
          ],
          "pots": Array [
            Object {
              "amount": 340,
              "eligiblePlayers": Array [
                Object {
                  "bet": 0,
                  "folded": false,
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
                  "legalActions": undefined,
                  "stackSize": 3010,
                },
                Object {
                  "bet": 0,
                  "folded": false,
                  "holeCards": Array [
                    Object {
                      "color": "#000000",
                      "rank": "6",
                      "suit": "s",
                      "suitChar": "♠",
                    },
                    Object {
                      "color": "#000000",
                      "rank": "7",
                      "suit": "s",
                      "suitChar": "♠",
                    },
                  ],
                  "id": "John",
                  "isSelf": false,
                  "left": false,
                  "legalActions": undefined,
                  "stackSize": 2010,
                },
              ],
              "winners": Array [
                Object {
                  "bet": 0,
                  "folded": false,
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
                  "legalActions": undefined,
                  "stackSize": 3010,
                },
                Object {
                  "bet": 0,
                  "folded": false,
                  "holeCards": Array [
                    Object {
                      "color": "#000000",
                      "rank": "6",
                      "suit": "s",
                      "suitChar": "♠",
                    },
                    Object {
                      "color": "#000000",
                      "rank": "7",
                      "suit": "s",
                      "suitChar": "♠",
                    },
                  ],
                  "id": "John",
                  "isSelf": false,
                  "left": false,
                  "legalActions": undefined,
                  "stackSize": 2010,
                },
              ],
            },
          ],
          "smallBlind": 5,
          "smallBlindPosition": 7,
          "winners": Array [
            Object {
              "bet": 0,
              "folded": false,
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
              "legalActions": undefined,
              "stackSize": 3010,
            },
            Object {
              "bet": 0,
              "folded": false,
              "holeCards": Array [
                Object {
                  "color": "#000000",
                  "rank": "6",
                  "suit": "s",
                  "suitChar": "♠",
                },
                Object {
                  "color": "#000000",
                  "rank": "7",
                  "suit": "s",
                  "suitChar": "♠",
                },
              ],
              "id": "John",
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
              "stackSize": 2010,
            },
          ],
        }
      `);
    });

    test("and viewerId not in winners", () => {
      const nonWinnerId = "nonWinnerIdValue";
      if (!!table.winners!.find((winner) => nonWinnerId === winner?.id)) {
        throw new Error(`${nonWinnerId} is id in table.winners`);
      }
      const view = viewOfTable(nonWinnerId, table);
      expect(view).toMatchInlineSnapshot(`
        Object {
          "bigBlind": 10,
          "bigBlindPosition": 0,
          "buyIn": 1000,
          "communityCards": Array [
            Object {
              "color": "#000000",
              "rank": "T",
              "suit": "s",
              "suitChar": "♠",
            },
            Object {
              "color": "#000000",
              "rank": "J",
              "suit": "s",
              "suitChar": "♠",
            },
            Object {
              "color": "#000000",
              "rank": "Q",
              "suit": "s",
              "suitChar": "♠",
            },
            Object {
              "color": "#000000",
              "rank": "K",
              "suit": "s",
              "suitChar": "♠",
            },
            Object {
              "color": "#000000",
              "rank": "A",
              "suit": "s",
              "suitChar": "♠",
            },
          ],
          "currentBet": undefined,
          "currentPosition": undefined,
          "currentRound": undefined,
          "dealerPosition": 3,
          "handNumber": 1,
          "players": Array [
            Object {
              "bet": 0,
              "folded": false,
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
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
              "stackSize": 3010,
            },
            Object {
              "bet": 0,
              "folded": true,
              "holeCards": undefined,
              "id": "Juan",
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
              "stackSize": 9189,
            },
            null,
            Object {
              "bet": 0,
              "folded": false,
              "holeCards": Array [
                Object {
                  "color": "#000000",
                  "rank": "6",
                  "suit": "s",
                  "suitChar": "♠",
                },
                Object {
                  "color": "#000000",
                  "rank": "7",
                  "suit": "s",
                  "suitChar": "♠",
                },
              ],
              "id": "John",
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
              "stackSize": 2010,
            },
            null,
            null,
            null,
            Object {
              "bet": 0,
              "folded": true,
              "holeCards": undefined,
              "id": "Jay",
              "isSelf": false,
              "left": true,
              "legalActions": undefined,
              "stackSize": 31405,
            },
            null,
            null,
          ],
          "pots": Array [
            Object {
              "amount": 340,
              "eligiblePlayers": Array [
                Object {
                  "bet": 0,
                  "folded": false,
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
                  "isSelf": false,
                  "left": false,
                  "legalActions": undefined,
                  "stackSize": 3010,
                },
                Object {
                  "bet": 0,
                  "folded": false,
                  "holeCards": Array [
                    Object {
                      "color": "#000000",
                      "rank": "6",
                      "suit": "s",
                      "suitChar": "♠",
                    },
                    Object {
                      "color": "#000000",
                      "rank": "7",
                      "suit": "s",
                      "suitChar": "♠",
                    },
                  ],
                  "id": "John",
                  "isSelf": false,
                  "left": false,
                  "legalActions": undefined,
                  "stackSize": 2010,
                },
              ],
              "winners": Array [
                Object {
                  "bet": 0,
                  "folded": false,
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
                  "isSelf": false,
                  "left": false,
                  "legalActions": undefined,
                  "stackSize": 3010,
                },
                Object {
                  "bet": 0,
                  "folded": false,
                  "holeCards": Array [
                    Object {
                      "color": "#000000",
                      "rank": "6",
                      "suit": "s",
                      "suitChar": "♠",
                    },
                    Object {
                      "color": "#000000",
                      "rank": "7",
                      "suit": "s",
                      "suitChar": "♠",
                    },
                  ],
                  "id": "John",
                  "isSelf": false,
                  "left": false,
                  "legalActions": undefined,
                  "stackSize": 2010,
                },
              ],
            },
          ],
          "smallBlind": 5,
          "smallBlindPosition": 7,
          "winners": Array [
            Object {
              "bet": 0,
              "folded": false,
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
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
              "stackSize": 3010,
            },
            Object {
              "bet": 0,
              "folded": false,
              "holeCards": Array [
                Object {
                  "color": "#000000",
                  "rank": "6",
                  "suit": "s",
                  "suitChar": "♠",
                },
                Object {
                  "color": "#000000",
                  "rank": "7",
                  "suit": "s",
                  "suitChar": "♠",
                },
              ],
              "id": "John",
              "isSelf": false,
              "left": false,
              "legalActions": undefined,
              "stackSize": 2010,
            },
          ],
        }
      `);
    });
  });
});
