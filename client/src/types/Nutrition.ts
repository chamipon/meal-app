import { z } from "zod";

export const NutritionSchema = z.object({
    calories: z.coerce.number().nonnegative(),
    protein: z.coerce.number().nonnegative(),
    fat: z.coerce.number().nonnegative(),
    carbs: z.coerce.number().nonnegative(),
}).describe("NutritionSchema");