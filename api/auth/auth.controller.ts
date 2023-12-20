import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../../model/users/user.model";
import { sendInternalError } from "../../helpers/responses";

dotenv.config();

export class AuthController {
  async login(req: Request, res: Response) {
    console.log("console.log", req.body);
    try {
      const { email, password } = req.body;
      // Check if the email and password combination exists in the database
      const user = await userModel.findOne({ email, password });
      if (user) {
        // Generate JWT token
        const token = jwt.sign({ email }, String(process.env.JWT_SECRET_KEY));
        // Store the token in the session
        (req.session as any).token = token;
        res.json({ success: true, token });
      } else {
        console.log("Invalid credentials");
        res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }
}

export default AuthController;
