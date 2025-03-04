import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const SavedRecipes = () => {
    const [savedRecipes, setSavedRecipes] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/recipes/saved", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => setSavedRecipes(data.savedRecipes || []))
            .catch((error) => console.error("Error fetching saved recipes:", error));
    }, []);

    const handleRemoveRecipe = (recipeId) => {
        fetch(`http://localhost:8080/api/recipes/saved/${recipeId}`, {
            method: "DELETE",
            credentials: "include",
        })
            .then((res) => res.json())
            .then(() => {
                setSavedRecipes(savedRecipes.filter((recipe) => recipe.recipeId !== recipeId));
            })
            .catch((error) => console.error("Error removing recipe:", error));
    };

    // Handle Drag-and-Drop Reordering
    const handleDragEnd = (result) => {
        if (!result.destination) return; // If dropped outside, do nothing

        const reorderedRecipes = [...savedRecipes];
        const [movedRecipe] = reorderedRecipes.splice(result.source.index, 1);
        reorderedRecipes.splice(result.destination.index, 0, movedRecipe);

        setSavedRecipes(reorderedRecipes);
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", textAlign: "center" }}>
            <h1 style={{ fontSize: "26px", color: "#333", marginBottom: "10px" }}>Saved Recipes</h1>

            {savedRecipes.length === 0 ? (
                <p style={{ fontSize: "18px", color: "#555" }}>No saved recipes found.</p>
            ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="recipes-list">
                        {(provided) => (
                            <ul
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{ padding: "0", listStyle: "none" }}
                            >
                                {savedRecipes.map((recipe, index) => (
                                    <Draggable key={recipe.recipeId} draggableId={recipe.recipeId.toString()} index={index}>
                                        {(provided) => (
                                            <li
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    padding: "12px",
                                                    margin: "8px 0",
                                                    background: "#f8f9fa",
                                                    borderRadius: "8px",
                                                    cursor: "grab",
                                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                                    transition: "0.2s ease-in-out",
                                                    ...provided.draggableProps.style,
                                                }}
                                            >
                                                <span style={{ fontSize: "16px", fontWeight: "500", color: "#333" }}>{recipe.title}</span>
                                                <button
                                                    onClick={() => handleRemoveRecipe(recipe.recipeId)}
                                                    style={{
                                                        padding: "6px 12px",
                                                        fontSize: "14px",
                                                        background: "#dc3545",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "5px",
                                                        cursor: "pointer",
                                                        transition: "0.3s",
                                                    }}
                                                    onMouseOver={(e) => (e.target.style.background = "#c82333")}
                                                    onMouseOut={(e) => (e.target.style.background = "#dc3545")}
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            )}
        </div>
    );
};

export default SavedRecipes;
