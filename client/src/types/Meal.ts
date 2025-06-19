import { type Food, FoodSchema } from "./Food";
import { z } from "zod";
export interface Meal {
	_id: string;
	title: string;
	foods: Food[];
}

export const MealSchema = z.object({
	title: z.string().min(1, "Title is required"),
	foods: z.array(FoodSchema).min(1, "At least one food is required"),
});
