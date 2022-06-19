export type ResBody = {
  id: string;
  name: string;
}[];

export type ReqQuery = {
  name?: string;
  creatorId?: string;
  openSeat?: boolean;
};
