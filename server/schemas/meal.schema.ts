import mongoose, { Schema, Document, Types } from "mongoose";
import { IFood } from "./food.schema";

export interface IMeal extends Document {
	title: string;
	created_at: Date;
	foods: Types.ObjectId[] | IFood[];
}

const MealSchema = new Schema<IMeal>({
	title: { type: String, required: true },
	created_at: { type: Date, default: Date.now },
	foods: [{ type: Schema.Types.ObjectId, ref: "Food" }],
});

export const Meal = mongoose.model<IMeal>("Meal", MealSchema);
