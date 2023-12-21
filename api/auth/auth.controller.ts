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

      const user = await userModel.findOne({ username: username });
      if (!user) {
        console.log("Invalid username");
        res.status(401).json({ success: false, message: "Invalid username" });
        return;
      }

      console.log("login password: ", password);
      console.log("db hashed: ", user.password);
      const isMatch = await Bun.password.verify(password, user.password);
      if (!isMatch) {
        console.log("Invalid password");
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

      res.json({ success: true, token: token });
    } catch (error) {
      sendInternalError(res, error);
    }
  }
}

export default AuthController;
