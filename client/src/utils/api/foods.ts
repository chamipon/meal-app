import axios from "axios";
import type { FoodModel } from "@/types/Food";
export async function getFoods() {
	const res = await axios.get("http://localhost:8888/foods");
	const data: FoodModel[] = res.data;
	return data;
}

export async function addFood(title: string) {
	if (!title.trim()) return;

	const body = { title: title };
	const res = await axios.post("http://localhost:8888/foods", body);
	const data: FoodModel = res.data;

	return data;
}

export async function deleteFoods() {
	const res = await axios.delete("http://localhost:8888/foods");
	return res.data;
}

export async function deleteFood(id: string) {
	const res = await axios.delete(`http://localhost:8888/foods/${id}`);
	return res.data;
}
