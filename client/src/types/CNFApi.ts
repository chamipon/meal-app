import { z } from "zod";

// CNF Food List Item schema
export const CNFFoodSchema = z.object({
    food_code: z.number(),
    food_description: z.string(),
    food_group_id: z.number().optional(),
    food_group_name: z.string().optional(),
});

// CNF Foods List Response schema
export const CNFFoodsListResponseSchema = z.object({
    count: z.number(),
    foods: z.array(CNFFoodSchema),
});

// CNF Population Request schema
export const CNFPopulateRequestSchema = z.object({
    limit: z.number().optional().default(100),
    nutrient_groups: z.array(z.number()).optional(),
});

// CNF Population Response schema
export const CNFPopulateResponseSchema = z.object({
    message: z.string(),
    results: z.object({
        processed: z.number(),
        saved: z.number(),
        skipped: z.number(),
        errors: z.number(),
    }),
});

// CNF Add Ingredient Request schema
export const CNFAddIngredientRequestSchema = z.object({
    food_code: z.number(),
    nutrient_groups: z.array(z.number()).optional(),
});

// Types
export type CNFFood = z.infer<typeof CNFFoodSchema>;
export type CNFFoodsListResponse = z.infer<typeof CNFFoodsListResponseSchema>;
export type CNFPopulateRequest = z.infer<typeof CNFPopulateRequestSchema>;
export type CNFPopulateResponse = z.infer<typeof CNFPopulateResponseSchema>;
export type CNFAddIngredientRequest = z.infer<typeof CNFAddIngredientRequestSchema>;
