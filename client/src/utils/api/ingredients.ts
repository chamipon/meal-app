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
		...(updated.name !== undefined && { name: updated.name }),
		...(updated.unit !== undefined && { unit: updated.unit }),
        ...(updated.nutrition !== undefined && { nutrition: updated.nutrition }),
	};
	const res = await axios.put(`http://localhost:8888/ingredients/${id}`, body);
	const data: IngredientModel = res.data;
	return data;
}
