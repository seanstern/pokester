import { Player } from "@chevtek/poker-engine";
import { Fixture } from "../TypeUtils";
import { playersSeated, preFlop, completeRound } from "./Table.fixture";

export const playerSeated: Fixture<Player> = {
  description: "Player seated at table, pre-game",
  create: () => playersSeated.create().players[0]!,
};

export const lastActorPostDealPreFlop: Fixture<Player> = {
  description: "Player who is last actor immeidately after cards dealt",
  create: () => {
    const { lastActor } = preFlop.create();
    return lastActor!;
  },
};

export const currentActorPostDealPreFlop: Fixture<Player> = {
  description: "Player who is current actor immediately after cards dealt",
  create: () => {
    const { currentActor } = preFlop.create();
    return currentActor!;
  },
};

export const winner: Fixture<Player> = {
  description: "Player who is winner immediately after completion of round",
  create: () => {
    const { winners } = completeRound.create();
    return winners![0];
  },
};
