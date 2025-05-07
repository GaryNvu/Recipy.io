import { NextRequest, NextResponse } from "next/server";
import base from "@/lib/airtable/client";
import { Ingredient } from "../interfaces/ingredient";

const table = base("Ingredients");

export async function GET() {
  try {
    const records = await table.select({
      sort: [{ field: "Name", direction: "asc" }]
    }).all();

    const ingredients = await Promise.all(
      records.map(async (record) => {
        const ingredient : Ingredient = {
          id: record.id as string,
          name: record.fields["Name"] as string,
          quantity: record.fields["Quantity"] as number,
          unit: record.fields["Unit"] as string,
        };

        return { ...ingredient };
      })
    );

    return NextResponse.json(ingredients, { status: 200 });
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return NextResponse.json({ error: "Failed to fetch ingredients" }, { status: 500 });
  }
}