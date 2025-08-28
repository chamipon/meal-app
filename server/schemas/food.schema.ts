// models/Food.ts
import mongoose, { Document, Schema, Types } from "mongoose";
import { CNFNutrientSchema, ICNFNutrient } from "./ingredient.schema.js";
export interface IFoodIngredient {
	ingredient_id: Types.ObjectId;
	quantity: number; // in same units as the ingredient
}

export interface IFood extends Document {
	title: string;
	ingredients: IFoodIngredient[];
	total_nutrition: ICNFNutrient[];
}

const FoodIngredientSchema = new Schema<IFoodIngredient>({
	ingredient_id: {
		type: Schema.Types.ObjectId,
		ref: "Ingredient",
		required: true,
	},
	quantity: { type: Number, required: true },
});

const FoodSchema = new Schema<IFood>({
	title: { type: String, required: true },
	ingredients: { type: [FoodIngredientSchema], required: true },
	total_nutrition: { type: [CNFNutrientSchema], required: true },
});

export default mongoose.model<IFood>("Food", FoodSchema);
