import { NextResponse } from "next/server";
import base from "@/lib/airtable/client";
//import bcrypt from "bcryptjs";

const table = base("Users");

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    const query: any = {};

    if (role) {
      query.filterByFormula = `{Role} = '${role}'`;
    }

    const records = await table.select(query).all();
    const users = records.map((r) => ({ id: r.id, ...r.fields }));

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}