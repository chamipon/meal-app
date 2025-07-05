import { IIngredient } from '../schemas/ingredient.schema';  // Assuming you have an ingredient model
import { INutrition } from '../schemas/nutrition.schema';

async function calculateTotalNutrition(ingredients: IIngredient[]): Promise<INutrition> {
  let totalNutrition: INutrition = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  };

  for (const ingredient of ingredients) {
    
    // Calculate nutrition for the ingredient
    const ingredientNutrition = ingredient.nutrition;

    // Multiply by the quantity of the ingredient in the food
    totalNutrition.calories += ingredientNutrition.calories * ingredient.amount.quantity;
    totalNutrition.protein += ingredientNutrition.protein * ingredient.amount.quantity;
    totalNutrition.fat += ingredientNutrition.fat * ingredient.amount.quantity;
    totalNutrition.carbs += ingredientNutrition.carbs * ingredient.amount.quantity;
  }

  return totalNutrition;
}