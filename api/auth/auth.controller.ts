import { Request, Response } from "express";
import dotenv from "dotenv";
import userModel from "../../model/users/user.model";
import {
  sendInternalError,
  sendNotFound,
  sendSuccess,
} from "../../helpers/responses";
import * as jose from "jose";

dotenv.config();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      console.log("username", username);

      const user = await userModel.findOne({
        $or: [
          { username: username },
          { "data.type": "merchant", "data.data.contactEmail": username },
        ],
      });
      if (!user) {
        res
          .status(401)
          .json({ success: false, message: "Invalid username or email" });
        return;
      }

      const isMatch = await Bun.password.verify(password, user.password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: "Invalid password" });
        return;
      }

      const secret = new TextEncoder().encode(
        String(process.env.JWT_SECRET_KEY)
      );
      const alg = "HS256";

      const token = await new jose.SignJWT({ "urn:example:claim": true })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer("urn:example:issuer")
        .setAudience("urn:example:audience")
        .setExpirationTime("2h")
        .sign(secret);

      res.json({ success: true, token: token, role: user.data.type });
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async usertype(req: Request, res: Response) {
    try {
      const { username } = req.params;

      const user = await userModel.findOne({ username: username });
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      res.json({ success: true, userType: user.data.type });
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async checkUsername(req: Request, res: Response) {
    try {
      const { username } = req.params;
      console.log("username", username);

      const user = await userModel.findOne({
        $or: [
          { username: username },
          { "data.type": "merchant", "data.data.contactEmail": username },
        ],
      });
      if (user) {
        res.json({
          success: true,
          message: "Username or email already exists",
        });
      } else {
        res.json({
          success: false,
          message: "Username and email are available",
        });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async getMerchantId(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const user = await userModel.findOne({
        $or: [{ username: username }],
      });
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      let merchantId;
      if (user.data.type === "merchant") {
        merchantId = user.data.data.merchantId;
      }

      res.json({ success: true, userId: merchantId });
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const { userId, oldPassword, newPassword } = req.body;

      // Retrieve the user from the database
      const user = await userModel.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Check if the old password is correct
      const isMatch = await Bun.password.verify(oldPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Incorrect old password" });
      }

      // Hash the new password and update the user's password in the database
      const hashedPassword = await Bun.password.hash(newPassword);
      user.password = hashedPassword;
      await user.save();

      res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "An error occurred", error });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      // Retrieve the user from the database
      const userId = Number(req.params.userId);
      const user = await userModel.findById(userId);
      if (!user) {
        sendNotFound(res, "User not found");
      }
      sendSuccess(res, { data: user });
    } catch (error) {
      console.error("An error occurred while retrieving the user:", error);
      sendInternalError(res, error);
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      // Retrieve all users from the database
      const users = await userModel.find();
      if (!users) {
        sendNotFound(res, "Users not found");
      }
      sendSuccess(res, { data: users });
    } catch (error) {
      console.error("An error occurred while retrieving the users:", error);
      sendInternalError(res, error);
    }
  }

  async getUserIdByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const user = await userModel.findOne({
        "data.type": "merchant",
        "data.data.contactEmail": email,
      });
      if (!user) {
        sendNotFound(res, "User not found");
      } else {
        sendSuccess(res, { data: user.userId });
      }
    } catch (error) {
      console.error("An error occurred while retrieving the user:", error);
      sendInternalError(res, error);
    }
  }
}

export default AuthController;
