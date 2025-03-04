const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  savedRecipes: [
    {
      recipeId: String,
      title: String,
      image: String,
      order: Number,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
