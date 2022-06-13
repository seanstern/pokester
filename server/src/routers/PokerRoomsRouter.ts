import { Router } from "express";
import { create, get, act } from "../controllers/PokerRoomsController";

const PokerRoomsRouter = Router();
PokerRoomsRouter.route("/").post(create);
PokerRoomsRouter.route("/:roomId").get(get).patch(act);

export default PokerRoomsRouter;
