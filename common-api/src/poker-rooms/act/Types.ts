import { Player, Table } from "@chevtek/poker-engine";
import PlayerAction from "../PlayerAction";

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
  seatNumber?: Parameters<Table["sitDown"]>[2];
};

type StandActReqBody = {
  action: PlayerAction.STAND;
};

type DealActReqBody = {
  action: PlayerAction.DEAL;
};

export type VariableWagerActReqBody = BetActReqBody | RaiseActReqBody;

export type ReqBody =
  | BetActReqBody
  | CallActReqBody
  | RaiseActReqBody
  | CheckActReqBody
  | FoldActReqBody
  | SitActReqBody
  | StandActReqBody
  | DealActReqBody;
