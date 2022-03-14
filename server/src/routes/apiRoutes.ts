import { Router } from "express";
import gamesRoutes from "./gamesRoutes";

const apiRoutes = Router();
apiRoutes.use("/games", gamesRoutes);

export default apiRoutes;
