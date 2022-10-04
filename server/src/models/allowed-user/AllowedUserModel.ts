import { model } from "mongoose";
import AllowedUserSchema, { AllowedUserDoc } from "./AllowedUserSchema";

const AllowedUserModel = model<AllowedUserDoc>(
  "AllowedUser",
  AllowedUserSchema
);

export default AllowedUserModel;
