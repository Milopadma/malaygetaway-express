import express, { Request, Response } from "express";
import session from "express-session";
import jwt from "jsonwebtoken";

const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Middleware for session management
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure to true for HTTPS
  })
);

// Auth API endpoint
app.post("/api/auth/login", (req: Request, res: Response) => {
  // Check if the username and password are valid
  const { username, password } = req.body;
  if (username === "admin" && password === "password") {
    // Generate JWT token
    const token = jwt.sign({ username }, "your-jwt-secret-key");

    // Store the token in the session
    (req.session as any).token = token;

    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Protected API endpoint
app.get("/api/protected", (req: Request, res: Response) => {
  // Verify the JWT token from the session
  const token = req.session.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, "your-jwt-secret-key");
      res.json({ success: true, message: "Protected data", user: decoded });
    } catch (error) {
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  } else {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
