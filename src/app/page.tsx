"use client";

import { useState, useEffect } from "react";
import { getAllRecipes } from "@/services/recipe";
import RecipeGrid from "../components/RecipesGrid";
import SearchBar from "../components/SearchBar";
import AddButton from "../components/AddButton";
import Link from "next/link";
import LoadingSpinner from "../components/LoadingSpinner";
import { Recipe } from "@/app/api/interfaces/recipe";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      const data = await getAllRecipes();
      setRecipes(data);
      setIsLoading(false);
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    if (!search) return true;
    const titleMatch = recipe.name.toLowerCase().includes(search.toLowerCase());
    const ingredientMatch = recipe.ingredients?.some((ing) =>
      ing.name.toLowerCase().includes(search.toLowerCase())
    );
    const allergenMatch = recipe.allergens?.some((allergen) =>
      allergen.name.toLowerCase().includes(search.toLowerCase())
    );
    const typeMatch = recipe.type.toLowerCase().includes(search.toLowerCase());
    return titleMatch || ingredientMatch || allergenMatch || typeMatch;
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-gray-100 w-4/5 mx-auto mt-8 grid grid-rows-[20px_1fr_20px] min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="row-start-2 w-full">
        <div className="flex flex-row items-center mb-6 gap-x-4">
          <SearchBar value={search} onChange={setSearch} />
          <AddButton />
        </div>

        <RecipeGrid recipes={filteredRecipes}/>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p className="text-xs text-gray-500">© Recipy.io ESGI - 2025</p>
      </footer>
    </div>
  );
}