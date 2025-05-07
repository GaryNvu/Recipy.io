import { Allergen } from './allergen';
import { Ingredient } from './ingredient';

interface NutritionalInfo {
    calories: string;
    proteins: string;
    carbohydrates: string;
    lipids: string;
    vitamins: string;
    minerals: string;
  }

  export interface Recipe {
    id: string;
    name: string;
    type: string;
    peoples: number;
    description: string;
    steps: string[];
    nutritionalInfo: NutritionalInfo;
    ingredients: Ingredient[];
    allergens?: Allergen[];
  }