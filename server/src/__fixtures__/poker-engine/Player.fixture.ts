import { Player } from "@chevtek/poker-engine";
import { Fixture } from "../TypeUtils";
import { playersSeated, preFlop, completeRound, turn } from "./Table.fixture";

export const playerSeated: Fixture<Player> = {
  description: "Player seated at table, pre-game",
  create: () => playersSeated.create().players[0]!,
};

export const priorActorPostDealPreFlop: Fixture<Player> = {
  description:
    "Player immediately priort to current actor, immeidately after cards dealt",
  create: () => {
    const { lastActor } = preFlop.create();
    if (!lastActor) {
      throw new Error("No lastActor in preFlop Table.fixture");
    }
    return lastActor;
  },
};

export const currentActorPostDealPreFlop: Fixture<Player> = {
  description: "Player who is current actor, immediately after cards dealt",
  create: () => {
    const { currentActor } = preFlop.create();
    if (!currentActor) {
      throw new Error("No currentActor in preFlop Table.fixture");
    }
    return currentActor!;
  },
};

export const foledPlayer: Fixture<Player> = {
  description:
    "Player who has folded during flop, immediately at start of turn",
  create: () => {
    const { players } = turn.create();
    const foldedPlayer = players.find((player) => player?.folded === true);
    if (!foldedPlayer) {
      throw new Error("No foldedPlayer in turn Table.fixture");
    }
    return foldedPlayer;
  },
};

export const winner: Fixture<Player> = {
  description: "Player who is winner, immediately after completion of round",
  create: () => {
    const { winners } = completeRound.create();
    if (!winners) {
      throw new Error("No winners array in completeRound Table.fixture");
    }
    if (winners.length < 1) {
      throw new Error(
        "No elements in winners array in completeRound Table.fixture"
      );
    }
    return winners[0];
  },
};
