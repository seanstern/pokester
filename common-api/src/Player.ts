import { Player as PokerEnginePlayer } from "@chevtek/poker-engine";
import Card from "./Card";

type CommonPlayer = Pick<
  PokerEnginePlayer,
  "bet" | "folded" | "left" | "id" | "stackSize"
> & {
  holeCards?: [Card, Card];
};

export enum PlayerAction {
  CHECK = "check",
  BET = "bet",
  RAISE = "raise",
  CALL = "call",
  FOLD = "fold",
}

export type SelfPlayer = CommonPlayer & {
  isSelf: true;
  legalActions?: PlayerAction[];
};

export type OpponentPlayer = CommonPlayer & {
  isSelf: false;
};

export type Player = SelfPlayer | OpponentPlayer;
