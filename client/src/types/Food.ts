import type { Ingredient } from "./Ingredient";

export interface Food {
	_id: string;
	title: string;
	ingredients: Ingredient[];
}
