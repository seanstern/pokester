import { Router } from "express";
import { get, patch } from "../controllers/user";

const UserRouter = Router();
UserRouter.route("/").get(get).patch(patch);

export default UserRouter;
