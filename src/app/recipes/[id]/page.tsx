"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, Trash } from "lucide-react" // Replace "some-icon-library" with the actual library or path
import { getRecipeById } from "@/services/recipe";
import { deleteRecipe } from "@/services/recipe";
import { use } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useRouter } from "next/navigation";

export default function RecipeDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const data = await getRecipeById(id);
      if (!data) {
        notFound();
      } else {
        setRecipe(data);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteRecipe(id);
      router.push("/");
    } catch (error) {
      console.error("Error deleting recipe", error);
    }
  }


  if (!recipe) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-5xl mx-auto mt-6 p-12 space-y-8 shadow-md rounded-lg bg-white">
      <div className="flex items-center justify-between mb-4">
        <Link href="/" className="flex flex-row gap-2 text-blue-600 px-4 py-2 rounded hover:border-gray-300 hover:shadow-md">
          <ArrowLeft></ArrowLeft>
          Retour
        </Link>
        <button onClick={handleDelete} className="flex flex-row gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200">
          Supprimer
          <Trash></Trash>
        </button>
      </div>
      <h1 className="text-4xl font-bold mt-4 mb-0">{recipe.name}</h1>
      <h3 className="text-2xl text-gray-600 italic">{recipe.type} - {recipe.peoples}</h3>

      <div>
        <h2 className="recipe-details-h2">Description</h2>
        <p className="text-gray-800 leading-relaxed">{recipe.description}</p>
      </div>

      <div>
        <h2 className="recipe-details-h2">Allergènes :</h2>
        {recipe.allergens && recipe.allergens.length > 0 ? (
          <div className="flex flex-row gap-4 flex-wrap">
            {recipe.allergens.map((allergen: any, index: number) => (
              <span className="bg-blue-400 rounded-full text-white px-2 py-1">{allergen.name}</span>
            ))}
          </div>
        ) : (
          <p className="text-gray-700">Aucun allergène trouvé.</p>
        )}
      </div>

      <div>
        <h2 className="recipe-details-h2">Ingrédients :</h2>
        <ul className="space-y-4">
          {recipe.ingredients.map((ing: any, index: number) => (
            <li key={index} className="flex items-center space-x-4">
              <span className="text-gray-700">
                - {ing.name} : {ing.quantity} {ing.unit}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="recipe-details-h2">Etapes :</h2>
        <ul className="space-y-4">
          {recipe.steps.map((step: any, index: number) => (
            <li key={index} className="flex items-center space-x-4">
              <span className="text-gray-700">
               {index + 1 } - {step}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
      <h2 className="recipe-details-h2">Analyse nutritionnelle :</h2>
        <ul className="space-y-4">
          {Object.entries(recipe.nutritionalInfo).map(([key, value]) => (
            <li key={key} className="flex items-center">
              <span className="text-gray-700 capitalize">
                - {key}: {String(value)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}