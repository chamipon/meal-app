import { z } from "zod";

export const NutritionSchema = z.object({
    calories: z.coerce.number().nonnegative(),
    protein: z.coerce.number().nonnegative(),
    fat: z.coerce.number().nonnegative(),
    carbs: z.coerce.number().nonnegative(),
}).describe("NutritionSchema");

// Shared fields
const BaseIngredientSchema = z.object({
    name: z.string().min(1),
    unit: z.string().default('g'),
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
