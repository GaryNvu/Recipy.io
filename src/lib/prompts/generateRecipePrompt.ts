type GeneratePromptParams = {
    type: string;
    peoples: number;
    ingredients: string[];
    allergens: string[];
  };
  
  export const generateRecipePrompt = ({ type, peoples, ingredients, allergens }: GeneratePromptParams) => {
    return `
  Tu es un assistant culinaire.

  Génère uniquement un objet JSON (aucune explication, aucun texte avant ou après).
  
  Génère une recette personnalisée pour un/une ${type}, pour ${peoples} personne(s) avec les ingrédients suivants : ${ingredients.join(", ")}.
  
  Évite les allergènes suivants : ${allergens.length > 0 ? allergens.join(", ") : "aucun"}.

  Ton résultat incluera les informations suivantes :
  Nom de la recette, description, étapes de préparation, liste des ingrédients avec les quantités et les unités, type de plat (Plat / Entrée / Dessert), et une analyse nutritionnelle.

  Donne-moi la réponse au format JSON suivant, il est important que tu mettes les clés et que tu n'entoures pas la réponse avec des guillements ou d'autres caractères.:
  
  {
    "name": "Nom de la recette",
    "description": "Description de la recette",
    "steps": [
      "Étape 1",
      "Étape 2",
      "Étape 3"
      ...
      "Étape N"
    ],
    "nutritionalInfo": {
      "calories": "Valeur en kcal",
      "proteins": "Valeur en g",
      "carbohydrates": "Valeur en g",
      "lipids": "Valeur en g",
      "vitamins": "A, B, C,...",
      "minerals": "Calcium, Fer,..."
    },
    "ingredients": [
      {
        "name": "Nom ingrédient",
        "quantity": 0,
        "unit": "g / ml / pièces"
      }
    ],
  }
  `;
};
  