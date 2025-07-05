// models/Ingredient.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface INutrition {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface IIngredient extends Document {
  name: string;
  unit: string;
  nutrition: INutrition;
}

const NutritionSchema = new Schema<INutrition>({
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  fat: { type: Number, required: true },
  carbs: { type: Number, required: true },
});

const IngredientSchema = new Schema<IIngredient>({
  name: { type: String, required: true },
  unit: { type: String, required: true, default: 'g' },
  nutrition: { type: NutritionSchema, required: true },
});

export default mongoose.model<IIngredient>('Ingredient', IngredientSchema);
