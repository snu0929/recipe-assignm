require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const { connection } = require("./db");
const MongoStore = require("connect-mongo");
require("./config/passport");
const { recipeRouter } = require("./routes/recipe.routes");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL, // ✅ Use MongoDB for session storage
      ttl: 14 * 24 * 60 * 60, // Sessions expire in 14 days
    }),
    cookie: {
      secure: true, // ✅ Important for HTTPS (set to false if testing locally)
      httpOnly: true, // ✅ Prevents client-side JS access to cookies
      sameSite: "none", // ✅ Important for cross-origin cookies
    },
  })
);

// Initialize passport
passport.serializeUser((user, done) => {
  console.log("Serializing User:", user); // ✅ Debugging
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log("Deserializing User:", user); // ✅ Debugging
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:5173");
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

app.use("/api/recipes", recipeRouter);

app.listen(8080, async () => {
  await connection();
  console.log("App is running on port 8080");
});
