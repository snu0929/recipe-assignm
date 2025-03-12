import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_BASE_URL } from "../config";
const RecipeDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                const response = await fetch(`${BACKEND_BASE_URL}/api/recipes/details/${id}`);
                if (!response.ok) throw new Error("Failed to fetch recipe details");

                const data = await response.json();
                setRecipe(data);
            } catch (error) {
                console.error("Error fetching recipe details:", error);
                setError("Could not load recipe details.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecipeDetails();
    }, [id]);

    if (loading) return <p style={{ textAlign: "center", fontSize: "18px", color: "#007BFF" }}>Loading...</p>;
    if (error) return <p style={{ textAlign: "center", color: "red", fontSize: "18px" }}>{error}</p>;

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", textAlign: "center" }}>
            <h1 style={{ fontSize: "28px", color: "#333", marginBottom: "10px" }}>{recipe.title}</h1>

            {/* Recipe Image */}
            <img
                src={recipe.image}
                alt={recipe.title}
                style={{
                    width: "100%",
                    maxWidth: "500px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                }}
            />

            {/* Ingredients List */}
            <h3 style={{ fontSize: "22px", color: "#555", marginTop: "20px" }}>Ingredients:</h3>
            <ul style={{ textAlign: "left", padding: "0 20px" }}>
                {recipe.extendedIngredients?.map((ingredient) => (
                    <li key={ingredient.id} style={{ fontSize: "16px", marginBottom: "5px", color: "#444" }}>
                        {ingredient.original}
                    </li>
                ))}
            </ul>

            {/* Instructions */}
            <h3 style={{ fontSize: "22px", color: "#555", marginTop: "20px" }}>Instructions:</h3>
            <p
                dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                style={{
                    fontSize: "16px",
                    textAlign: "left",
                    lineHeight: "1.6",
                    color: "#333",
                    padding: "10px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "5px"
                }}
            />
        </div>
    );
};

export default RecipeDetails;
