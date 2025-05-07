import { NextRequest, NextResponse } from "next/server";
import { generateRecipePrompt } from "@/lib/prompts/generateRecipePrompt";
import { openai } from "@/lib/openai/client";
import base from "@/lib/airtable/client";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, peoples, ingredients, allergens } = body;

  const prompt = generateRecipePrompt({ type, peoples, ingredients, allergens });

  const aiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "Tu es un assistant culinaire." },
        { role: "user", content: prompt }
      ]
    }),
  });

  const data = await aiResponse.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    return NextResponse.json({ error: "Erreur de génération" }, { status: 500 });
  }

  try {
    const parsedContent = JSON.parse(content);
    return NextResponse.json(parsedContent);
  } catch (e) {
    console.error("Erreur de parsing JSON :", e);
    return NextResponse.json({ error: "La réponse n'est pas au format JSON." }, { status: 500 });
  }
}
