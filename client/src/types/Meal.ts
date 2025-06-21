import { type FoodModel, FoodSchema } from "./Food";
import { z } from "zod";
export interface MealModel {
	_id: string;
	title: string;
	foods: FoodModel[];
}

export const MealSchema = z.object({
	_id: z.string(),
	title: z.string().min(1, "Title is required"),
	foods: z.array(FoodSchema).min(1, "At least one food is required"),
});
