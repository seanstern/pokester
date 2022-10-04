import { Router } from "express";
import OIDCIdentifierExtension from "../middleware/request-extensions/OIDCIdentifierExtension";
import UserExtension from "../middleware/request-extensions/UserExtension";
import verifyAllowedUser from "../middleware/verifyAllowedUser";
import PokerRoomsRouter from "./PokerRoomsRouter";
import UserRouter from "./UserRouter";

export const APIRouter = Router();
APIRouter.use(
  OIDCIdentifierExtension.extend,
  verifyAllowedUser,
  UserExtension.extend
);
APIRouter.use("/rooms", PokerRoomsRouter);
APIRouter.use("/user", UserRouter);

export default APIRouter;
