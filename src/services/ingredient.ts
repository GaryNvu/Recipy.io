import { Ingredient } from "@/app/api/interfaces/ingredient";

export async function getAllIngredients(): Promise<Ingredient[]> {
    const res = await fetch("/api/ingredients", { cache: "no-store" });
    
    if (!res.ok) {
        throw new Error("Erreur lors du chargement des ingrédients");
    }
    
    const data = await res.json();
    return data;
}
