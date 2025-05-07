import { Recipe } from "@/app/api/interfaces/recipe";

export async function getAllRecipes(): Promise<Recipe[]> {
  const res = await fetch("/api/recipes", { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des recettes");
  }

  const data = await res.json();
  return data;
}

export async function getRecipeById(id: string): Promise<Recipe> {
  const res = await fetch(`/api/recipes/${id}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement de la recette");
  }

  const data = await res.json();
  return data;
}

export async function createRecipe(recipe: Recipe): Promise<Recipe> {
  const res = await fetch("/api/recipes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipe),
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la création de la recette");
  }

  const data = await res.json();
  return data;
}

export async function deleteRecipe(id: string): Promise<void> {
  const res = await fetch(`/api/recipes/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la suppression de la recette");
  }
}