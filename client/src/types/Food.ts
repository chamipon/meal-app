import { type IngredientModel, IngredientSchema } from "./Ingredient";
import { z } from "zod";
export interface FoodModel {
	_id: string;
	title: string;
	ingredients: IngredientModel[];
}
export const FoodSchema = z.object({
	_id: z.string(),
	title: z.string().min(1, "Food title is required"),
	ingredients: z
		.array(IngredientSchema)
		.min(1, "At least one ingredient is required"),
});
