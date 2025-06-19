import axios from "axios";
import type { Ingredient } from "@/types/Ingredient";
export async function getIngredients() {
	const res = await axios.get("http://localhost:8888/ingredients");
	const data: Ingredient[] = res.data;
	return data;
}

export async function addIngredient(title: string) {
	if (!title.trim()) return;

	const body = { title: title };
	const res = await axios.post("http://localhost:8888/ingredients", body);
	const data: Ingredient = res.data;

	return data;
}

export async function deleteIngredients() {
	const res = await axios.delete("http://localhost:8888/ingredients");
	return res.data;
}

export async function deleteIngredient(id: string) {
	const res = await axios.delete(`http://localhost:8888/ingredients/${id}`);
	return res.data;
}
