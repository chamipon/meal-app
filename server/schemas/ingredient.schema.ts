import mongoose, { Schema, Document } from "mongoose";

export interface IIngredient extends Document {
	title: string;
	created_at: Date;
}

const IngredientSchema = new Schema<IIngredient>({
	title: { type: String, required: true },
	created_at: { type: Date, default: Date.now },
});

export const Ingredient = mongoose.model<IIngredient>(
	"Ingredient",
	IngredientSchema
);
