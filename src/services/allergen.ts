export const getAllAllergens = async () => {
  const res = await fetch("/api/allergens", { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des allergènes");
  }

  const data = await res.json();
  return data;
}   