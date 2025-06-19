import axios from "axios";
import type { Meal } from "@/types/Meal";
export async function getMeals() {
	const res = await axios.get("http://localhost:8888/meals");
	const data: Meal[] = res.data;
	return data;
}

export async function addMeal(title: string) {
	if (!title.trim()) return;

	const body = { title: title };
	const res = await axios.post("http://localhost:8888/meals", body);
	const data: Meal = res.data;

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
