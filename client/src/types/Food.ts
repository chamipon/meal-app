import { type Ingredient, IngredientSchema } from "./Ingredient";
import { z } from "zod";
export interface Food {
	_id: string;
	title: string;
	ingredients: Ingredient[];
}
export const FoodSchema = z.object({
	_id: z.string(),
	title: z.string().min(1, "Food title is required"),
	ingredients: z
		.array(IngredientSchema)
		.min(1, "At least one ingredient is required"),
});
