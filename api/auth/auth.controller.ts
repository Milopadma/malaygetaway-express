import { Request, Response } from "express";
import dotenv from "dotenv";
import userModel from "../../model/users/user.model";
import { sendInternalError } from "../../helpers/responses";
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
}

export default AuthController;
