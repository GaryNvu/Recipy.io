"use client";

import Image from "next/image";
import Link from "next/link";
import { Recipe } from "@/app/api/interfaces/recipe";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="block border border-gray-300 rounded-xl shadow-md p-4 hover:shadow-lg transition-transform transform hover:scale-105"
    >
      <h2 className="text-xl font-semibold">{recipe.name}</h2>
      <p className="text-sm text-gray-500 mb-2 italic">
        {recipe.ingredients?.map((ing) => ing.name).join(", ") || "Aucun ingrédient"}
      </p>
      <p className="text-sm text-gray-600 line-clamp-3">
        {recipe.description?.length > 140
          ? `${recipe.description.slice(0, 140)}...`
          : recipe.description}
      </p>
    </Link>
  );
}