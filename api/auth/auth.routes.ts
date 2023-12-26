import Express from "express";
import { AuthController } from "./auth.controller";

const controller = new AuthController();
const AuthRouter = Express.Router();

AuthRouter.post("/login", controller.login);
AuthRouter.get("/usertype/:username", controller.usertype);
AuthRouter.get("/check/username/:username", controller.checkUsername);
AuthRouter.get("/getMerchantId/:username", controller.getMerchantId);

AuthRouter.get("/getUsers", controller.getUsers);
AuthRouter.get("/getUser/:userId", controller.getUserById);

// change password
AuthRouter.post("/changePassword", controller.changePassword);

export default AuthRouter;
