import { useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_BASE_URL } from "../config";


const Home = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${BACKEND_BASE_URL}/api/recipes/search?query=${searchQuery}`);
            const data = await response.json();

            if (response.ok) {
                setRecipes(data.recipes);
            } else {
                setError(data.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Error fetching recipes:", error);
            setError("Failed to fetch recipes");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveRecipe = async (recipe) => {
        try {
            const response = await fetch(`${BACKEND_BASE_URL}/api/recipes/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    recipeId: recipe.id,
                    title: recipe.title,
                    image: recipe.image,
                }),
            });

            const data = await response.json();
            alert(data.message); // Show success/error message
        } catch (error) {
            console.error("Error saving recipe:", error);
        }
    };

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", textAlign: "center" }}>
            <h1 style={{ fontSize: "28px", color: "#333" }}>Welcome to Recipe Finder</h1>
            <p style={{ fontSize: "16px", color: "#555" }}>Search and save your favorite recipes!</p>

            {/* Search Bar */}
            <form
                onSubmit={handleSearch}
                style={{
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap"
                }}
            >
                <input
                    type="text"
                    placeholder="Search for a recipe..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        padding: "10px",
                        width: "80%",
                        maxWidth: "400px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        fontSize: "16px"
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: "10px 20px",
                        marginLeft: "10px",
                        border: "none",
                        borderRadius: "5px",
                        backgroundColor: "#007BFF",
                        color: "white",
                        fontSize: "16px",
                        cursor: "pointer"
                    }}
                >
                    Search
                </button>
            </form>

            {loading && <p style={{ fontSize: "16px", color: "#007BFF" }}>Loading recipes...</p>}
            {error && <p style={{ color: "red", fontSize: "16px" }}>{error}</p>}

            {/* Display Recipes */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                    marginTop: "20px"
                }}
            >
                {recipes.map((recipe) => (
                    <div
                        key={recipe.id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "15px",
                            borderRadius: "10px",
                            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                            textAlign: "center",
                            background: "white"
                        }}
                    >
                        <h3 style={{ fontSize: "18px", color: "#333" }}>{recipe.title}</h3>
                        <img
                            src={recipe.image}
                            alt={recipe.title}
                            style={{ width: "100%", borderRadius: "10px", maxHeight: "180px", objectFit: "cover" }}
                        />
                        <div style={{ marginTop: "10px" }}>
                            <button
                                onClick={() => handleSaveRecipe(recipe)}
                                style={{
                                    background: "#28a745",
                                    color: "white",
                                    padding: "8px 12px",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    marginRight: "10px"
                                }}
                            >
                                Save to Favorites
                            </button>
                            <Link to={`/recipe/${recipe.id}`}>
                                <button
                                    style={{
                                        background: "#007BFF",
                                        color: "white",
                                        padding: "8px 12px",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer"
                                    }}
                                >
                                    See Details
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
