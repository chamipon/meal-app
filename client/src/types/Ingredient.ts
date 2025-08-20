import { z } from "zod";
import { CNFNutrientSchema } from "./CNFNutrient";

// Source enum
export const IngredientSourceEnum = z.enum(['cnf', 'manual']);
export type IngredientSource = z.infer<typeof IngredientSourceEnum>;

// Base ingredient schema aligned with CNF structure
const BaseIngredientSchema = z.object({
    // Food identification (food_code optional for manual entries)
    food_code: z.number().optional(),
    food_description: z.string().min(1, "Food description is required"),
    
    // Food categorization (from CNF)
    food_group_id: z.number().optional(),
    food_group_name: z.string().optional(),
    
    // Metadata
    source: IngredientSourceEnum.default('manual'),
    created_at: z.coerce.date().optional(),
    updated_at: z.coerce.date().optional(),
    
    // Nutritional data using CNF structure
    nutrients: z.array(CNFNutrientSchema).default([]),
});

// For creating ingredients (no _id, created_at, updated_at)
export const CreateIngredientSchema = BaseIngredientSchema.omit({
    created_at: true,
    updated_at: true,
});

// For full ingredients (e.g., fetched from DB)
export const IngredientSchema = BaseIngredientSchema.extend({
    _id: z.string(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

// Types
export type IngredientModel = z.infer<typeof IngredientSchema>;
export type CreateIngredientModel = z.infer<typeof CreateIngredientSchema>;
