import { ResBody as ResBodyType } from "./Types";
import { Fixture } from "@pokester/poker-engine-fixtures";

const standard: Fixture<ResBodyType> = {
  description: "Standard poker-rooms/create response body",
  create: () => "aStandardRoomId",
};

export const ResBody = {
  standard,
};
