import Express from "express";
import { AuthController } from "./auth.controller";

const controller = new AuthController();
const AuthRouter = Express.Router();

AuthRouter.post("/login", controller.login);

export default AuthRouter;
