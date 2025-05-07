import { NextRequest, NextResponse } from "next/server";
import base from "@/lib/airtable/client";
import { Ingredient } from "../interfaces/ingredient";
import { Recipe } from "../interfaces/recipe";
import { Type } from "lucide-react";

const table = base("Recipes");

export async function GET() {
  try {
    const records = await table.select({
      sort: [{ field: "Name", direction: "asc" }]
    }).all();

    const recipes = await Promise.all(
      records.map(async (record) => {
        const linkedIngredientIds = (record.fields["Ingredients"]) as string[] || [];
        
        let ingredients: Ingredient[] = [];

        if (linkedIngredientIds.length > 0) {
          const ingredientsRecord = await base("Ingredients")
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

        const steps = JSON.parse(record.fields["Steps"] as string || "[]");
        const nutritionalInfo = JSON.parse(record.fields["Analysis"] as string || "{}");

        const recipe : Recipe = {
          id: record.id,
          name: record.fields["Name"] as string,
          type: record.fields["Type"] as string,
          peoples: record.fields["Peoples"] as number,
          description: record.fields["Description"] as string,
          steps,
          nutritionalInfo,
          ingredients,
        };

        return { ...recipe };
      })
    );

    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, type, peoples, description, ingredients, allergens } = body;

    const created = await table.create({
      Name: name,
      Type: type,
      Peoples: peoples,
      Description: description,
      Ingredients: ingredients,
      Allergens: allergens,
      Steps: JSON.stringify(body.steps),
      Analysis: JSON.stringify(body.nutritionalInfo),
    });

    return NextResponse.json({ id: created.id, ...created.fields }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}