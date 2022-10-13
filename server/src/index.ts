import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { auth, ConfigParams } from "express-openid-connect";
import { connect, connection } from "mongoose";
import path from "path";
import handleValidationError from "./middleware/error-handlers/handle-validation-error";
import APIRouter from "./routers/APIRouter";

(async () => {
  const app = express();

  app.use(express.json());

  app.use(express.static(path.join(__dirname, "../../client/build")));

  const apiAuthConfig: ConfigParams = {
    authRequired: true,
    auth0Logout: true,
    secret: process.env.OPEN_ID_CONNECT_SECRET,
    baseURL: process.env.OPEN_ID_CONNECT_BASE_URL,
    clientID: process.env.OPEN_ID_CONNECT_CLIENT_ID,
    issuerBaseURL: process.env.OPEN_ID_CONNECT_ISSUER_BASE_URL,
    errorOnRequiredAuth: true,
    routes: {
      login: false,
      logout: false,
    },
  };
  app.use("/api", auth(apiAuthConfig), APIRouter);

  const authRoutesConfig: ConfigParams = {
    ...apiAuthConfig,
    authRequired: false,
    errorOnRequiredAuth: false,
    routes: {
      login: "/account/login",
      logout: "/account/logout",
    },
    getLoginState: (req, options) => {
      return { ...options, returnTo: "/rooms" };
    },
  };

  app.use(auth(authRoutesConfig));
  app.get("/account/signup", (req, res) => {
    res.oidc.login({
      authorizationParams: {
        screen_hint: "signup",
      },
    });
    return;
  });
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "../../client/build", "index.html"))
  );

  app.use(handleValidationError);

  try {
    await connect(process.env.MONGOOSE_CONNECT || "");
    console.log("mongoose connected");
    connection.on("error", () => console.log("mongoose conneciton error"));

    app.listen(5000, () => console.log("server listening on port 5000"));
  } catch (err) {
    console.log("mongoose initial connection error");
  }
})();
