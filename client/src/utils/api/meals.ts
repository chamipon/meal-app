import axios from "axios";
import type { MealModel } from "@/types/Meal";
export async function getMeals() {
	const res = await axios.get("http://localhost:8888/meals");
	const data: MealModel[] = res.data;
	return data;
}

export async function addMeal(meal: MealModel) {
	const body = { title: meal.title, foods: meal.foods };
	const res = await axios.post("http://localhost:8888/meals", body);
	const data: MealModel = res.data;

	return data;
}

export async function deleteMeals() {
	const res = await axios.delete("http://localhost:8888/meals");
	return res.data;
}

export async function deleteMeal(id: string) {
	const res = await axios.delete(`http://localhost:8888/meals/${id}`);
	return res.data;
}
