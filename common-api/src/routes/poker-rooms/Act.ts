import { Player } from "@chevtek/poker-engine";
import PlayerAction from "./PlayerAction";

export { PlayerAction };

type BetActReqBody = {
  action: PlayerAction.BET;
  amount: Parameters<Player["betAction"]>[0];
};

type CallActReqBody = {
  action: PlayerAction.CALL;
};

type RaiseActReqBody = {
  action: PlayerAction.RAISE;
  amount: Parameters<Player["raiseAction"]>[0];
};

type CheckActReqBody = {
  action: PlayerAction.CHECK;
};

type FoldActReqBody = {
  action: PlayerAction.FOLD;
};

type SitActReqBody = {
  action: PlayerAction.SIT;
};

type StandActReqBody = {
  action: PlayerAction.STAND;
};

export type ReqBody =
  | BetActReqBody
  | CallActReqBody
  | RaiseActReqBody
  | CheckActReqBody
  | FoldActReqBody
  | SitActReqBody
  | StandActReqBody;
