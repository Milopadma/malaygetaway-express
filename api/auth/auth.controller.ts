import { model } from "mongoose";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Login } from "../../types";
import dotenv from "dotenv";
import { Model } from "mongoose";

const {
  sendCreated,
  sendInternalError,
  sendInvalid,
  sendSuccess,
  sendNotFound,
  sendConflict,
  sendUnauthorized,
} = require("../../helpers/responses");
dotenv.config();

    export class AuthController {
        private userModel: Model<User>; // Replace 'User' with your user model

        constructor(userModel: Model<User>) {
            this.userModel = userModel;
        }

        async login(req: Request<Login>, res: Response) {
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
          sendInternalError(res, error);
        }
      }
}
