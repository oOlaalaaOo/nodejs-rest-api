import express, { Router } from "express";
import authController from "./auth.controller";

const authRouter: Router = express.Router();

authRouter.route("/login").post(authController.login);

export default authRouter;
