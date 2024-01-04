import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function authenticateToken(
  req: { headers: { [x: string]: any }; user: any },
  res: { sendStatus: (arg0: number) => void },
  next: () => void
) {
  // Get the token from the headers
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    // If there's no token, return an error
    return res.sendStatus(401);
  }

  jwt.verify(
    token,
    String(process.env.ACCESS_TOKEN_SECRET),
    (err: any, user: any) => {
      if (err) {
        // If the token is not valid, return an error
        return res.sendStatus(403);
      }

      // If the token is valid, set the user in the request and call next
      req.user = user;
      next();
    }
  );
}
