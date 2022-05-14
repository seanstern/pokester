import { Player as PokerEnginePlayer } from "@chevtek/poker-engine";
import Card from "./Card";

type CommonPlayer = Pick<
  PokerEnginePlayer,
  "bet" | "folded" | "left" | "id" | "stackSize"
>;

export enum PlayerAction {
  CHECK = "check",
  BET = "bet",
  RAISE = "raise",
  CALL = "call",
  FOLD = "fold",
}

type SelfPlayer = CommonPlayer & {
  isSelf: true;
  holeCards?: [Card, Card];
  legalActions?: PlayerAction[];
};

type OpponentPlayer = CommonPlayer & {
  isSelf: false;
};

type Player = SelfPlayer | OpponentPlayer;

export default Player;
