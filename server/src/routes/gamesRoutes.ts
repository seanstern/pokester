import { Router } from "express";
import GameController from "../controllers/GamesController";

const gamesRoutes = Router();
gamesRoutes.route("/").get(GameController.getAll).post(GameController.create);
gamesRoutes
  .route("/:gameID")
  .get(GameController.get)
  .patch(GameController.takeTurn);

export default gamesRoutes;
