import MongoStore from "connect-mongo";
import express from "express";
import session from "express-session";
import { connect, connection } from "mongoose";
import path from "path";
import apiRoutes from "./routes/apiRoutes";

(async () => {
  const app = express();

  app.use(express.json());

  app.use(
    session({
      secret: "development-secret",
      store: MongoStore.create({
        mongoUrl: "mongodb://127.0.0.1:27017/game",
      }),
      cookie: {
        httpOnly: true,
        sameSite: "lax",
      },
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use(express.static(path.join(__dirname, "../../client/build")));

  app.use("/api", apiRoutes);

  try {
    await connect("mongodb://127.0.0.1:27017/game");
    console.log("mongoose connected");
    connection.on("error", () => console.log("mongoose conneciton error"));

    app.listen(5000, () => console.log("server listening on port 5000"));
  } catch (err) {
    console.log("mongoose initial connection error");
  }
})();
