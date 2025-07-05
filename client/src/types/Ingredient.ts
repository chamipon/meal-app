import { z } from "zod";
import { AmountSchema } from "./Amount";
import { NutritionSchema } from "./Nutrition";

// Shared fields
const BaseIngredientSchema = z.object({
    name: z.string().min(1),
    amount: AmountSchema,
    nutrition: NutritionSchema,
    
});

// For creating ingredients (no _id)
export const CreateIngredientSchema = BaseIngredientSchema;

// For full ingredients (e.g., fetched from DB or editing)
export const IngredientSchema = BaseIngredientSchema.extend({
	_id: z.string().readonly(),
});

// Full type
export type IngredientModel = z.infer<typeof IngredientSchema>;

// Create: explicitly no _id
export type CreateIngredientModel = Omit<IngredientModel, "_id">;
