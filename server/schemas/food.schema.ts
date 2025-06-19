import mongoose, { Schema, Document, Types } from "mongoose";
import { IIngredient } from "./ingredient.schema";

export interface IFood extends Document {
	title: string;
	ingredients: Types.ObjectId[] | IIngredient[];
}

const FoodSchema = new Schema<IFood>({
	title: { type: String, required: true },
	ingredients: [
		{ type: Schema.Types.ObjectId, required: true, ref: "Ingredient" },
	],
});

export const Food = mongoose.model<IFood>("Food", FoodSchema);
