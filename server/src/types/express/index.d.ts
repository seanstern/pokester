import { HydratedUserDoc } from "../../models/user";

declare global {
  namespace Express {
    export interface Request {
      user?: HydratedUserDoc | null;
    }
  }
}
