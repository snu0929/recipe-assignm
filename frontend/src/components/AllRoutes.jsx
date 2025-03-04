import React from 'react'
import Home from '../pages/Home'
import SavedRecipes from '../pages/SavedRecipes'
import { Route, Routes } from 'react-router-dom'
import RecipeDetails from '../pages/RecipeDetails'

export const AllRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/saved" element={<SavedRecipes />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
        </Routes>
    )
}
