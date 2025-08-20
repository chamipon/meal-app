import { z } from "zod";

// CNF Nutrient Name schema
export const CNFNutrientNameSchema = z.object({
    nutrient_name_id: z.number(),
    nutrient_symbol: z.string(),
    nutrient_name: z.string(),
    unit: z.string(),
    nutrient_code: z.number(),
    tagname: z.string().optional(),
    nutrient_decimals: z.number(),
    nutrient_web_order: z.number(),
    nutrient_web_name: z.string(),
    nutrient_group_id: z.number(),
});

// CNF Nutrient schema
export const CNFNutrientSchema = z.object({
    food_code: z.number(),
    nutrient_value: z.number(),
    standard_error: z.number().optional(),
    number_observation: z.number().optional(),
    nutrient_name_id: z.number(),
    nutrient_web_name: z.string().optional(),
    nutrient_source_id: z.number().optional(),
    nutrient_name: CNFNutrientNameSchema.optional(),
});

// Types
export type CNFNutrientName = z.infer<typeof CNFNutrientNameSchema>;
export type CNFNutrient = z.infer<typeof CNFNutrientSchema>;
