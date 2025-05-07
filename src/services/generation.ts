export async function generateRecipe(
    type: string,
    peoples: number,
    ingredients: string[],
    allergens?: string[]
    ) {
    const res = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        type,
        peoples,
        ingredients,
        allergens,
        }),
    });
    
    if (!res.ok) {
        throw new Error("Erreur lors de la génération de la recette");
    }
    
    const data = await res.json();
    return data;
}
