import { Table } from "@chevtek/poker-engine";

export type ReqBody = {
  name: string;
} & Pick<Table, "buyIn" | "smallBlind" | "bigBlind">;

export type ResBody = string;
