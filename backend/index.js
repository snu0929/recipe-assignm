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
    origin: "http://localhost:5173", // Allow frontend
    credentials: true, // Allow cookies & authentication
  })
);

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
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
    res.redirect("http://localhost:5173"); // Redirect back to frontend after login
  }
);
// ✅ Route to check user session (NEW)
app.get("/auth/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user); // Send user data
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.get("/auth/failure", (req, res) => {
  res.send("Failed to authenticate");
});

app.use("/api/recipes", recipeRouter);

app.listen(8080, async () => {
  await connection();
  console.log("App is running on port 8080");
});
