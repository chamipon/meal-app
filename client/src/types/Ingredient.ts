import { z } from "zod";

// Shared fields
const BaseIngredientSchema = z.object({
	name: z.string().min(1, "Ingredient name is required"),
	amount: z.coerce.number().min(0, "Amount must be non-negative"),
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
