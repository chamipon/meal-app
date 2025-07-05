import axios from "axios";
import type { CreateFoodModel, FoodModel } from "@/types/Food";
export async function getFoods() {
	const res = await axios.get("http://localhost:8888/foods");
	const data: FoodModel[] = res.data;
	return data;
}

export async function addFood(food: CreateFoodModel) {
	const body = { ...food };
	const res = await axios.post("http://localhost:8888/foods", body);
	return res;
}

export async function deleteFoods() {
	const res = await axios.delete("http://localhost:8888/foods");
	return res.data;
}

export async function deleteFood(id: string) {
	const res = await axios.delete(`http://localhost:8888/foods/${id}`);
	return res.data;
}
export async function editFood(id: string, updated: Partial<FoodModel>) {
	const body = {
		...(updated.ingredients !== undefined && { name: updated.ingredients }),
		...(updated.title !== undefined && { unit: updated.title }),
	};
	const res = await axios.put(`http://localhost:8888/foods/${id}`, body);
	return res;
}
