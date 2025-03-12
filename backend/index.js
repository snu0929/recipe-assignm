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
    origin: ["http://localhost:5173", "https://recipe-assignm.onrender.com"],
    credentials: true,
  })
);

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only true in production
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
    const redirectURL =
      process.env.NODE_ENV === "production"
        ? "https://recipe-assignm.onrender.com" // For production
        : "http://localhost:5173"; // For local frontend
    res.redirect(redirectURL);
  }
);

app.get("/auth/user", (req, res) => {
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
