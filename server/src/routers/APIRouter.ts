import { Router } from "express";
import PokerRoomsRouter from "./PokerRoomsRouter";

const APIRouter = Router();
APIRouter.use("/rooms", PokerRoomsRouter);

export default APIRouter;
