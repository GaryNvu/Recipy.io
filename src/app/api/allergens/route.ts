import { NextRequest, NextResponse } from "next/server";
import base from "@/lib/airtable/client";
import { Allergen } from "../interfaces/allergen";

const table = base("Allergens");

export async function GET() {
  try {
    const records = await table.select({
      sort: [{ field: "Name", direction: "asc" }]
    }).all();

    const allergens = await Promise.all(
      records.map(async (record) => {
        const allergen : Allergen = {
          id: record.id,
          name: record.fields["Name"] as string,
        };

        return { ...allergen };
      })
    );

    return NextResponse.json(allergens, { status: 200 });
  } catch (error) {
    console.error("Error fetching allergens:", error);
    return NextResponse.json({ error: "Failed to fetch allergens" }, { status: 500 });
  }
}