//import { IngredientSchema } from "./Ingredient";
import { z } from "zod";

// Shared fields
const BaseFoodSchema = z.object({
	title: z.string().min(1, "Food title is required"),
	ingredients: z
		.array(z.string())
		.min(1, "At least one ingredient is required")
		.describe("IngredientIdArray"),
});

// For creating ingredients (no _id)
export const CreateFoodSchema = BaseFoodSchema;

// For full ingredients (e.g., fetched from DB or editing)
export const FoodSchema = BaseFoodSchema.extend({
	_id: z.string().readonly(),
});

// Full type
export type FoodModel = z.infer<typeof FoodSchema>;

// Create: explicitly no _id
export type CreateFoodModel = Omit<FoodModel, "_id">;
