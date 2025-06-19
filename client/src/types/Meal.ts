import type { Ingredient } from "./Ingredient";

export interface Meal {
	_id: string;
	title: string;
	ingredients: Ingredient[];
}
