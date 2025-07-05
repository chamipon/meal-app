// models/Food.ts
import mongoose, { Document, Schema, Types } from 'mongoose';
import { INutrition } from './ingredient.schema';

export interface IFoodIngredient {
  ingredient_id: Types.ObjectId;
  quantity: number; // in same units as the ingredient
}

export interface IFood extends Document {
  name: string;
  ingredients: IFoodIngredient[];
  total_nutrition: INutrition;
}

const FoodIngredientSchema = new Schema<IFoodIngredient>({
  ingredient_id: { type: Schema.Types.ObjectId, ref: 'Ingredient', required: true },
  quantity: { type: Number, required: true },
});

const FoodSchema = new Schema<IFood>({
  name: { type: String, required: true },
  ingredients: { type: [FoodIngredientSchema], required: true },
  total_nutrition: {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    fat: { type: Number, required: true },
    carbs: { type: Number, required: true },
  },
});

export default mongoose.model<IFood>('Food', FoodSchema);
