import {
  emptyTable,
  playersSeated,
  preFlop,
  flop,
  turn,
  river,
  completeRound,
  roundTwo,
} from "@pokester/poker-engine-fixtures/table";
import { asJestCasesTable } from "@pokester/poker-engine-fixtures";
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
      const player = table.players.find((player) => player !== null);
      if (!player) {
        throw new Error("table doesn't contain non-null players");
      }
      const { id: viewerId } = player;
      const view = viewOfTable(viewerId, table);
      expect(view).toMatchSnapshot();
    });

    test("and viewerId not in players", () => {
      const nonPlayerId = "nonPlayerIdValue";
      if (table.players.find((player) => nonPlayerId === player?.id)) {
        throw new Error(`${nonPlayerId} is id in table.players`);
      }
      const view = viewOfTable(nonPlayerId, table);
      expect(view).toMatchSnapshot();
    });
  });

  describe(completeRound.description, () => {
    const table = completeRound.create();
    test("and viewerId in winners", () => {
      if (!table.winners) {
        throw new Error("table does not contain winners");
      }
      const { id: viewerId } = table.winners[0];
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
              "folded": true,
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
            null,
            Object {
              "bet": 0,
              "folded": true,
              "handDescr": undefined,
              "holeCards": undefined,
              "id": "John",
              "isSelf": false,
              "left": true,
              "legalActions": undefined,
              "stackSize": 1990,
            },
            null,
            null,
            null,
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
            },
          ],
          "smallBlind": 5,
          "smallBlindPosition": 7,
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
      const nonWinnerId = "nonWinnerIdValue";
      if (!table.winners) {
        throw new Error("table does not contain winners");
      }
      if (table.winners.find((winner) => nonWinnerId === winner?.id)) {
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
              "folded": true,
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
            null,
            Object {
              "bet": 0,
              "folded": true,
              "handDescr": undefined,
              "holeCards": undefined,
              "id": "John",
              "isSelf": false,
              "left": true,
              "legalActions": undefined,
              "stackSize": 1990,
            },
            null,
            null,
            null,
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
            },
          ],
          "smallBlind": 5,
          "smallBlindPosition": 7,
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
