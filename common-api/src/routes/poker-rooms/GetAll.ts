export type ResBody = {
  id: string;
  name: string;
  canSit: boolean;
  isSeated: boolean;
}[];

export type ReqQuery = {
  name?: string;
  creatorId?: string;
  canSit?: "true" | "false";
  isSeated?: "true" | "false";
};
