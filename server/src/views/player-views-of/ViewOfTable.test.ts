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

// describe("viewOfPot produces valid JSON when given", () => {
//   it(emptyPot.description, () => {
//     const view = viewOfPot("anyId", emptyPot.create());
//     expect(view.eligiblePlayers).toStrictEqual([]);
//     expect(view.winners).toBeUndefined();
//     expect(view).toMatchInlineSnapshot(`
//       Object {
//         "amount": 0,
//         "eligiblePlayers": Array [],
//         "winners": undefined,
//       }
//     `);
//   });

//   describe(potWithEligiblePlayersNoWinners.description, () => {
//     it("and viewerId in eligiblePlayers", () => {
//       const pot = potWithEligiblePlayersNoWinners.create();
//       if (pot.eligiblePlayers.length < 1) {
//         throw new Error("eligiblePlayers is empty");
//       }
//       const { id: viewierId } = pot.eligiblePlayers[0];
//       const view = viewOfPot(viewierId, pot);
//       expect(view.winners).toBeUndefined();
//       // Expectations of veiw.eligiblePlayers are implicitly
//       // checked by inline snapshot below (as opposed to
//       // explicit expect(view.elibiblePlayers).[EXPECTATION]
//       // because view.eligiblePlayers is defined by viewOfPlayer
//       // function, which is explicitly tsted in viewOfPlayer.test.ts
//       expect(view).toMatchInlineSnapshot(`
//         Object {
//           "amount": 40,
//           "eligiblePlayers": Array [
//             Object {
//               "bet": 0,
//               "folded": false,
//               "holeCards": Array [
//                 Object {
//                   "color": "#000000",
//                   "rank": "2",
//                   "suit": "s",
//                   "suitChar": "♠",
//                 },
//                 Object {
//                   "color": "#000000",
//                   "rank": "3",
//                   "suit": "s",
//                   "suitChar": "♠",
//                 },
//               ],
//               "id": "Jane",
//               "isSelf": true,
//               "left": false,
//               "legalActions": undefined,
//               "stackSize": 2990,
//             },
//             Object {
//               "bet": 0,
//               "folded": false,
//               "holeCards": undefined,
//               "id": "Juan",
//               "isSelf": false,
//               "left": false,
//               "legalActions": undefined,
//               "stackSize": 9189,
//             },
//             Object {
//               "bet": 0,
//               "folded": false,
//               "holeCards": undefined,
//               "id": "John",
//               "isSelf": false,
//               "left": false,
//               "legalActions": undefined,
//               "stackSize": 1990,
//             },
//             Object {
//               "bet": 0,
//               "folded": false,
//               "holeCards": undefined,
//               "id": "Jay",
//               "isSelf": false,
//               "left": false,
//               "legalActions": undefined,
//               "stackSize": 31405,
//             },
//           ],
//           "winners": undefined,
//         }
//       `);
//     });

//     it("and viewerId not in eligiblePlayers", () => {
//       const pot = potWithEligiblePlayersNoWinners.create();
//       const nonEligiblePlayerId = "nonEligiblePlayerIdValue";
//       if (
//         !!pot.eligiblePlayers.find(
//           ({ id: eligiblePlayerId }) => nonEligiblePlayerId === eligiblePlayerId
//         )
//       ) {
//         throw new Error(`${nonEligiblePlayerId} is id in pot.eligiblePlayers`);
//       }
//       const view = viewOfPot(nonEligiblePlayerId, pot);
//       expect(view.winners).toBeUndefined();
//       // Expectations of veiw.eligiblePlayers are implicitly
//       // checked by inline snapshot below (as opposed to
//       // explicit expect(view.elibiblePlayers).[EXPECTATION]
//       // because view.eligiblePlayers is defined by viewOfPlayer
//       // function, which is explicitly tsted in viewOfPlayer.test.ts
//       expect(view).toMatchInlineSnapshot(`
//         Object {
//           "amount": 40,
//           "eligiblePlayers": Array [
//             Object {
//               "bet": 0,
//               "folded": false,
//               "holeCards": undefined,
//               "id": "Jane",
//               "isSelf": false,
//               "left": false,
//               "legalActions": undefined,
//               "stackSize": 2990,
//             },
//             Object {
//               "bet": 0,
//               "folded": false,
//               "holeCards": undefined,
//               "id": "Juan",
//               "isSelf": false,
//               "left": false,
//               "legalActions": undefined,
//               "stackSize": 9189,
//             },
//             Object {
//               "bet": 0,
//               "folded": false,
//               "holeCards": undefined,
//               "id": "John",
//               "isSelf": false,
//               "left": false,
//               "legalActions": undefined,
//               "stackSize": 1990,
//             },
//             Object {
//               "bet": 0,
//               "folded": false,
//               "holeCards": undefined,
//               "id": "Jay",
//               "isSelf": false,
//               "left": false,
//               "legalActions": undefined,
//               "stackSize": 31405,
//             },
//           ],
//           "winners": undefined,
//         }
//       `);
//     });
//   });

//   describe(potWithWinners.description, () => {
//     it("and viewerId in winners", () => {
//       const pot = potWithWinners.create();
//       const { id: viewierId } = pot.winners[0];
//       const view = viewOfPot(viewierId, pot);
//       expect(view.winners).toBeDefined();
//       // Expectations of veiw.winners are implicitly
//       // checked by inline snapshot below (as opposed to
//       // explicit expect(view.winners).[EXPECTATION]
//       // because view.winners is defined by viewOfPlayer
//       // function, which is explicitly tsted in viewOfPlayer.test.ts
//       expect(view).toMatchInlineSnapshot(`
//         Object {
//           "amount": 340,
//           "eligiblePlayers": Array [
//             Object {
//               "bet": 0,
//               "folded": false,
//               "holeCards": Array [
//                 Object {
//                   "color": "#000000",
//                   "rank": "2",
//                   "suit": "s",
//                   "suitChar": "♠",
//                 },
//                 Object {
//                   "color": "#000000",
//                   "rank": "3",
//                   "suit": "s",
//                   "suitChar": "♠",
//                 },
//               ],
//               "id": "Jane",
//               "isSelf": true,
//               "left": false,
//               "legalActions": undefined,
//               "stackSize": 3010,
//             },
//             Object {
//               "bet": 0,
//               "folded": false,
//               "holeCards": Array [
//                 Object {
//                   "color": "#000000",
//                   "rank": "6",
//                   "suit": "s",
//                   "suitChar": "♠",
//                 },
//                 Object {
//                   "color": "#000000",
//                   "rank": "7",
//                   "suit": "s",
//                   "suitChar": "♠",
//                 },
//               ],
//               "id": "John",
//               "isSelf": false,
//               "left": false,
//               "legalActions": undefined,
//               "stackSize": 2010,
//             },
//           ],
//           "winners": Array [
//             Object {
//               "bet": 0,
//               "folded": false,
//               "holeCards": Array [
//                 Object {
//                   "color": "#000000",
//                   "rank": "2",
//                   "suit": "s",
//                   "suitChar": "♠",
//                 },
//                 Object {
//                   "color": "#000000",
//                   "rank": "3",
//                   "suit": "s",
//                   "suitChar": "♠",
//                 },
//               ],
//               "id": "Jane",
//               "isSelf": true,
//               "left": false,
//               "legalActions": undefined,
//               "stackSize": 3010,
//             },
//             Object {
//               "bet": 0,
//               "folded": false,
//               "holeCards": Array [
//                 Object {
//                   "color": "#000000",
//                   "rank": "6",
//                   "suit": "s",
//                   "suitChar": "♠",
//                 },
//                 Object {
//                   "color": "#000000",
//                   "rank": "7",
//                   "suit": "s",
//                   "suitChar": "♠",
//                 },
//               ],
//               "id": "John",
//               "isSelf": false,
//               "left": false,
//               "legalActions": undefined,
//               "stackSize": 2010,
//             },
//           ],
//         }
//       `);
//     });

//     it("and viewerId not in winners", () => {
//       const pot = potWithWinners.create();
//       const nonWinnerPlayerId = "nonWinnerPlayerIdValue";
//       if (
//         !!pot.winners.find(
//           ({ id: winnerPlayerId }) => nonWinnerPlayerId === winnerPlayerId
//         )
//       ) {
//         throw new Error(`${nonWinnerPlayerId} is id in pot.winners`);
//       }
//       const view = viewOfPot(nonWinnerPlayerId, pot);
//       expect(view.winners).toBeDefined();
//       // Expectations of veiw.winners are implicitly
//       // checked by inline snapshot below (as opposed to
//       // explicit expect(view.winners).[EXPECTATION]
//       // because view.winners is defined by viewOfPlayer
//       // function, which is explicitly tsted in viewOfPlayer.test.ts
//       expect(view).toMatchInlineSnapshot(`
//         Object {
//           "amount": 340,
//           "eligiblePlayers": Array [
//             Object {
//               "bet": 0,
//               "folded": false,
//               "holeCards": Array [
//                 Object {
//                   "color": "#000000",
//                   "rank": "2",
//                   "suit": "s",
//                   "suitChar": "♠",
//                 },
//                 Object {
//                   "color": "#000000",
//                   "rank": "3",
//                   "suit": "s",
//                   "suitChar": "♠",
//                 },
//               ],
//               "id": "Jane",
//               "isSelf": false,
//               "left": false,
//               "legalActions": undefined,
//               "stackSize": 3010,
//             },
//             Object {
//               "bet": 0,
//               "folded": false,
//               "holeCards": Array [
//                 Object {
//                   "color": "#000000",
//                   "rank": "6",
//                   "suit": "s",
//                   "suitChar": "♠",
//                 },
//                 Object {
//                   "color": "#000000",
//                   "rank": "7",
//                   "suit": "s",
//                   "suitChar": "♠",
//                 },
//               ],
//               "id": "John",
//               "isSelf": false,
//               "left": false,
//               "legalActions": undefined,
//               "stackSize": 2010,
//             },
//           ],
//           "winners": Array [
//             Object {
//               "bet": 0,
//               "folded": false,
//               "holeCards": Array [
//                 Object {
//                   "color": "#000000",
//                   "rank": "2",
//                   "suit": "s",
//                   "suitChar": "♠",
//                 },
//                 Object {
//                   "color": "#000000",
//                   "rank": "3",
//                   "suit": "s",
//                   "suitChar": "♠",
//                 },
//               ],
//               "id": "Jane",
//               "isSelf": false,
//               "left": false,
//               "legalActions": undefined,
//               "stackSize": 3010,
//             },
//             Object {
//               "bet": 0,
//               "folded": false,
//               "holeCards": Array [
//                 Object {
//                   "color": "#000000",
//                   "rank": "6",
//                   "suit": "s",
//                   "suitChar": "♠",
//                 },
//                 Object {
//                   "color": "#000000",
//                   "rank": "7",
//                   "suit": "s",
//                   "suitChar": "♠",
//                 },
//               ],
//               "id": "John",
//               "isSelf": false,
//               "left": false,
//               "legalActions": undefined,
//               "stackSize": 2010,
//             },
//           ],
//         }
//       `);
//     });
//   });
// });
