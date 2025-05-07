// src/app/api/recipes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import base from "@/lib/airtable/client";
import { Recipe } from "@/app/api/interfaces/recipe";
import { Ingredient } from "@/app/api/interfaces/ingredient";
import { Allergen } from "@/app/api/interfaces/allergen";

// Airtable
const recipeTable = base("Recipes");
const ingredientTable = base("Ingredients");
const allergenTable = base("Allergens");

// GET /api/recipes/[id]
export async function GET(req: NextRequest,  context : { params: { id: string } }) {
  const { id } = await context.params;

  try {
    const record = await recipeTable.find(id);

    if (!record) {
      return NextResponse.json({ error: "Recette introuvable" }, { status: 404 });
    }

    const linkedIngredientIds = (record.fields["Ingredients"] as string[]) || [];
    const linkedAllergenIds = (record.fields["Allergens"] as string[]) || [];

    let ingredients: Ingredient[] = [];
    let allergens: Allergen[] = [];

    if (linkedIngredientIds.length > 0) {
      const ingredientsRecord = await ingredientTable
        .select({
          filterByFormula: `OR(${linkedIngredientIds
            .map((id) => `RECORD_ID() = '${id}'`)
            .join(",")})`,
        })
        .all();

      ingredients = ingredientsRecord.map((ing) => ({
        id: ing.id as string,
        name: ing.fields["Name"] as string,
        quantity: typeof ing.fields["Quantity"] === "number" ? ing.fields["Quantity"] : 0,
        unit: ing.fields["Unit"] as string,
      }));
    }

    if (linkedAllergenIds.length > 0) {
      const allergensRecord = await allergenTable
        .select({
          filterByFormula: `OR(${linkedAllergenIds
            .map((id) => `RECORD_ID() = '${id}'`)
            .join(",")})`,
        })
        .all();

      allergens = allergensRecord.map((allergen) => ({
        id: allergen.id as string,
        name: allergen.fields["Name"] as string,
      }));
    }

    const steps = JSON.parse(record.fields["Steps"] as string || "[]");
    const nutritionalInfo = JSON.parse(record.fields["Analysis"] as string || "{}");

    const recipe: Recipe = {
      id: record.id,
      name: record.fields["Name"] as string,
      type: record.fields["Type"] as string,
      peoples: record.fields["Peoples"] as number,
      description: record.fields["Description"] as string,
      steps,
      nutritionalInfo,
      ingredients: ingredients,
      allergens: allergens,
    };

    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de la recette :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/recipes/[id]
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params;

  try {
    const deletedRecord = await recipeTable.destroy(id);

    if (!deletedRecord) {
      return NextResponse.json(
        { error: "Recette introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Recette supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de la recette :", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
