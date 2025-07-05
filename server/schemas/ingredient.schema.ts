// models/Ingredient.ts
import mongoose, { Document, Schema } from "mongoose";
import { INutrition, NutritionSchema, IAmount, AmountSchema } from "./nutrition.schema";


export interface IIngredient extends Document {
	name: string;
	unit: string;
	amount: IAmount;
	nutrition: INutrition;
}

const IngredientSchema = new Schema<IIngredient>({
	name: { type: String, required: true },
	amount: {type: AmountSchema, required:true},
	nutrition: { type: NutritionSchema, required: true },
});

export default mongoose.model<IIngredient>("Ingredient", IngredientSchema);
