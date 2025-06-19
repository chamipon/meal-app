import type { Food } from "./Food";

export interface Meal {
	_id: string;
	title: string;
	foods: Food[];
}
