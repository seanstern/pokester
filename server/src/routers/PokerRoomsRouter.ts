import { Router } from "express";
import { create, get, getAll, act } from "../controllers/PokerRoomsController";

const PokerRoomsRouter = Router();
PokerRoomsRouter.route("/").get(getAll).post(create);
PokerRoomsRouter.route("/:roomId").get(get).patch(act);

export default PokerRoomsRouter;
