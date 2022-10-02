import { Router } from "express";
import { act, create, get, getAll } from "../controllers/poker-rooms";
import RegistrationExtension from "../middleware/request-extensions/RegistrationExtension";

const PokerRoomsRouter = Router();
PokerRoomsRouter.use(RegistrationExtension.extend);
PokerRoomsRouter.route("/").get(getAll).post(create);
PokerRoomsRouter.route("/:roomId").get(get).patch(act);

export default PokerRoomsRouter;
