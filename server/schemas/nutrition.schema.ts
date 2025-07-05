import { Schema } from "mongoose";

export interface INutrition {
	calories: number;
	protein: number;
	fat: number;
	carbs: number;
}

export const NutritionSchema = new Schema<INutrition>({
	calories: { type: Number, required: true },
	protein: { type: Number, required: true },
	fat: { type: Number, required: true },
	carbs: { type: Number, required: true },
});

export interface IAmount {
	unit: string;
	quantity: number;
}

export const AmountSchema = new Schema<IAmount>({
	unit: { type: String, required: true },
	quantity: { type: Number, required: true },
});