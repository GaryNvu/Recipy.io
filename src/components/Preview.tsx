"use client";

import { useState, useEffect } from "react";
import { Recipe } from "@/app/api/interfaces/recipe";
import React from "react";
import LoadingSpinner from "./LoadingSpinner";

type Props = {
  recipe: Recipe | null;
  onAccept: () => void;
  onRegenerate: () => void;
};

export default function RecipePreview({ recipe, onAccept, onRegenerate }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  
  if (!recipe) {
    return (
      <div className="bg-white shadow-lg rounded-2xl p-6 h-[100%]">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Prévisualisation</h2>
        { isLoading ? (
          <LoadingSpinner />
        ) : (
          <p className="text-gray-500 italic">Aucune recette générée pour l’instant.</p>
        )}
      </div>
    );
  }

  if(isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 h-[100%] flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Prévisualisation</h2>
      <div className="space-y-2">
        <h3 className="text-lg font-bold">{recipe.name}</h3>
        <p className="text-sm text-gray-600 italic">{recipe.type}</p>
        <p>{recipe.description}</p>
        <h4 className="mt-4 font-semibold">Ingrédients :</h4>
        <ul className="list-disc list-inside">
          {recipe.ingredients.map((ing, index) => (
            <li key={index}>
              {ing.name} - {ing.quantity} {ing.unit}
            </li>
          ))}
        </ul>

        <h4 className="mt-4 font-semibold">Etapes :</h4>
        <ul className="list-disc list-inside">
          {recipe.steps.map((step: any, index: number) => (
              <li key={index} className="flex items-center space-x-4">
                <span className="text-gray-700">
                {index + 1 } - {step}
                </span>
              </li>
            ))}
        </ul>

        <h4 className="mt-4 font-semibold">Analyse nutritionnelle :</h4>
        <ul className="list-disc list-inside">
          {Object.entries(recipe.nutritionalInfo).map(([key, value]) => (
            <li key={key} className="flex items-center">
              <span className="text-gray-700 capitalize">
                - {key}: {String(value)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex gap-4">
          <button
            onClick={onAccept}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Accepter
          </button>
          <button
            onClick={onRegenerate}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
          >
            Régénérer
          </button>
        </div>
      </div>
    </div>
  );
}
