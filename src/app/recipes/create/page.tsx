"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Ingredient } from "@/app/api/interfaces/ingredient";
import { createRecipe, getAllRecipes } from "@/services/recipe";
import { generateRecipe } from "@/services/generation";
import { getAllIngredients } from "@/services/ingredient";
import { getAllAllergens } from "@/services/allergen";
import { Allergen } from "@/app/api/interfaces/allergen";
import RecipePreview from "@/components/Preview";

export default function CreateRecipePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [peoples, setPeoples] = useState<number>(1);
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);

  const MEAL_TYPES = [
    "Entrée",
    "Plat",
    "Dessert",
  ] as const;

  useEffect(() => {
    const fetchIngredients = async () => {
      const data = await getAllIngredients();
      setIngredients(data);
    };

    const fetchAllergens = async () => {
      const data = await getAllAllergens();
      setAllergens(data);
    }

    fetchIngredients();
    fetchAllergens();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const recipeData = {
        type: type,
        peoples: peoples,
        ingredients: selectedIngredients,
        allergens: selectedAllergens,
      };

      const result = await generateRecipe(recipeData.type, recipeData.peoples, recipeData.ingredients, recipeData.allergens);
      setGeneratedRecipe(result);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-[90%] grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mx-auto">
      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-8 space-y-6 md:col-span-1"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Paramètres de la recette</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm text-center">
            Recette créée !
          </p>
        )}

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Type de plat
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionnez un type</option>
            {MEAL_TYPES.map((mealType) => (
              <option key={mealType} value={mealType}>
                {mealType}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Nombre de personnes
          </label>
          <input
            type="number"
            value={peoples}
            onChange={(e) => setPeoples(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Allergènes
          </label>
          <div className="space-y-2 max-h-28 overflow-y-auto border border-gray-300 rounded-lg p-3">
            {allergens.map((allergen, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={allergen.name}
                  checked={selectedAllergens.includes(allergen.name)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAllergens((prev) => [...prev, allergen.name]);
                    } else {
                      setSelectedAllergens((prev) =>
                        prev.filter((name) => name !== allergen.name)
                      );
                    }
                  }}
                  className="accent-blue-600"
                />
                <span>{allergen.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Ingrédients
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
            {ingredients.map((ingredient, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={ingredient.name}
                  checked={selectedIngredients.includes(ingredient.name)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIngredients((prev) => [...prev, ingredient.name]);
                    } else {
                      setSelectedIngredients((prev) =>
                        prev.filter((name) => name !== ingredient.name)
                      );
                    }
                  }}
                  className="accent-blue-600"
                />
                <span>{ingredient.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
        >
          Générer une recette
        </button>
      </form>

      <div className="md:col-span-2">
        <RecipePreview
          recipe={generatedRecipe}
          onAccept={() => {
            if (generatedRecipe) {
              // Extraire uniquement les IDs des ingrédients sélectionnés
              const selectedIngredientIds = ingredients
              .filter(ing => selectedIngredients.includes(ing.name))
              .map(ing => ing.id);

              // Extraire uniquement les IDs des allergènes sélectionnés
              const selectedAllergenIds = allergens
                .filter(allergen => selectedAllergens.includes(allergen.name))
                .map(allergen => allergen.id);

              // Mettre à jour la recette avec les IDs
              const recipeToCreate = {
                ...generatedRecipe,
                type: type,
                peoples: peoples,
                ingredients: selectedIngredientIds,
                allergens: selectedAllergenIds
              };

              createRecipe(recipeToCreate).then(() => {
                setSuccess(true);
                router.push("/");
              });
            }
          }}
          onRegenerate={() => {
            setGeneratedRecipe(null);
          }}
        />
      </div>
    </div>
  );
}