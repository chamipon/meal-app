import axios from "axios";
import type { CreateIngredientModel, IngredientModel } from "@/types/Ingredient";

export async function getIngredients() {
	const res = await axios.get("http://localhost:8888/ingredients");
	const data: IngredientModel[] = res.data;
	return data;
}

export async function addIngredient(ingredient: CreateIngredientModel) {
	const body = { ...ingredient };
	const res = await axios.post("http://localhost:8888/ingredients", body);

	return res;
}

export async function deleteIngredients() {
	const res = await axios.delete("http://localhost:8888/ingredients");
	return res.data;
}

export async function deleteIngredient(id: string) {
	const res = await axios.delete(`http://localhost:8888/ingredients/${id}`);
	return res.data;
}

export async function editIngredient(id: string, updated: Partial<IngredientModel>) {
	const body = {
		...(updated.food_description !== undefined && { food_description: updated.food_description }),
        ...(updated.nutrients !== undefined && { nutrients: updated.nutrients }),
	};
	const res = await axios.put(`http://localhost:8888/ingredients/${id}`, body);
	return res;
}
