const express = require("express");
const recipeRouter = express.Router();
const axios = require("axios");
const { isAuthenticated } = require("../middleware/auth");
const User = require("../models/user.model");
recipeRouter.get("/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch`,
      {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
          query,
          number: 10,
        },
      }
    );

    const recipes = response.data.results;

    res.status(200).json({ recipes });
  } catch (error) {
    console.error("Error fetching recipes:", error.message);
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
});

recipeRouter.post("/save", isAuthenticated, async (req, res) => {
  const { recipeId, title, image } = req.body;

  if (!recipeId || !title || !image) {
    return res.status(400).json({ message: "All recipe fields are required." });
  }

  try {
    const user = await User.findById(req.user._id);

    // Check if the recipe is already saved
    const alreadySaved = user.savedRecipes.some(
      (recipe) => recipe.recipeId === recipeId
    );

    if (alreadySaved) {
      return res.status(409).json({ message: "Recipe already saved." });
    }

    // Save the new recipe
    user.savedRecipes.push({
      recipeId,
      title,
      image,
      order: user.savedRecipes.length + 1,
    });

    await user.save();
    res.status(200).json({ message: "Recipe saved successfully!" });
  } catch (error) {
    console.error("Error saving recipe:", error);
    res.status(500).json({ message: "Failed to save the recipe." });
  }
});

recipeRouter.get("/saved", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ googleId: req.user.googleId });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    res.status(500).json({ message: "Failed to fetch saved recipes" });
  }
});

recipeRouter.delete("/saved/:recipeId", isAuthenticated, async (req, res) => {
  try {
    const { recipeId } = req.params;
    const user = await User.findOne({ googleId: req.user.googleId });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    user.savedRecipes = user.savedRecipes.filter(
      (recipe) => recipe.recipeId !== recipeId
    );
    await user.save();

    res.status(200).json({ message: "Recipe removed successfully!" });
  } catch (error) {
    console.error("Error deleting saved recipe:", error);
    res.status(500).json({ message: "Failed to delete saved recipe" });
  }
});

recipeRouter.get("/details/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Recipe ID is required" });
  }

  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information`,
      {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching recipe details:", error.message);
    res.status(500).json({ message: "Failed to fetch recipe details" });
  }
});

recipeRouter.put("/reorder", isAuthenticated, async (req, res) => {
  try {
    const { reorderedRecipes } = req.body; // Get new order from frontend

    // Find the user in the database
    const user = await User.findOne({ googleId: req.user.googleId });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Update savedRecipes with new order
    user.savedRecipes = reorderedRecipes;

    // Save the updated user data
    await user.save();

    res.status(200).json({ message: "Recipe order updated successfully!" });
  } catch (error) {
    console.error("Error reordering recipes:", error);
    res.status(500).json({ message: "Failed to reorder recipes" });
  }
});

module.exports = {
  recipeRouter,
};
