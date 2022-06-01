import { Table } from "@chevtek/poker-engine";

export type ReqBody = {
  name: string;
} & Partial<Pick<Table, "buyIn" | "smallBlind" | "bigBlind">>;

export type ResBody = string;
