import { z } from "zod";

export interface Ingredient {
	_id: string;
	name: string;
	amount: number;
}
export const IngredientSchema = z.object({
	_id: z.string(),
	name: z.string().min(1, "Ingredient name is required"),
	amount: z.number().min(0, "Amount must be non-negative"),
});
