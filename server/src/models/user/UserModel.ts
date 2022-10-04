import { model, HydratedDocument } from "mongoose";
import UserSchema, { UserDoc } from "./UserSchema";

type HydratedUserDoc = HydratedDocument<UserDoc>;

export { UserDoc, HydratedUserDoc };

const User = model<UserDoc>("User", UserSchema);

export default User;
