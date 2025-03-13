require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const { connection } = require("./db");
require("./config/passport");
const { recipeRouter } = require("./routes/recipe.routes");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://recipe-assignm.onrender.com",
      "https://recipe-4kkqb2cqr-snu0929s-projects.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL); // Redirect back to frontend after login
  }
);

app.get("/auth/user", (req, res) => {
  console.log("Session:", req.session);
  console.log("User:", req.user);
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.get("/auth/failure", (req, res) => {
  res.send("Failed to authenticate");
});
app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
  });
});

app.use("/api/recipes", recipeRouter);

app.listen(8080, async () => {
  await connection();
  console.log("App is running on port 8080");
});
