import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../types";
import dotenv from "dotenv";
import { Model } from "mongoose";

const {
  sendInternalError,
} = require("../../helpers/responses");

dotenv.config();

export class AuthController {
    private userModel: Model<User>; // type generic defaults to EMPTY if none passed in
    constructor(userModel: Model<User>) {
        this.userModel = userModel;
    }

    async login(req: Request<User>, res: Response) {
        console.log("console.log", req.body);
        try {
            const { email, password } = req.body;

            // Check if the email and password combination exists in the database
            const user = await this.userModel.findOne({ email, password });

            if (user) {
                // Generate JWT token
                const token = jwt.sign({ email }, String(process.env.JWT_SECRET_KEY));

                // Store the token in the session
                (req.session as any).token = token;

                res.json({ success: true, token });
            } else {
                res.status(401).json({ success: false, message: "Invalid credentials" });
            }
        } catch (error) {
            sendInternalError(res, error);
        }
    }
}
export default AuthController;