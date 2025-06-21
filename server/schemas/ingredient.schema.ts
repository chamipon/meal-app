import mongoose, { Schema, Document } from "mongoose";

export interface IIngredient extends Document {
	name: string;
	amount: number;
	created_at: Date;
}

const IngredientSchema = new Schema<IIngredient>({
	name: { type: String, required: true },
	amount: { type: Number, required: true },
	created_at: { type: Date, default: Date.now },
});

export const Ingredient = mongoose.model<IIngredient>(
	"Ingredient",
	IngredientSchema
);
