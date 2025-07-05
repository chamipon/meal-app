// models/Meal.ts
import mongoose, { Document, Schema, Types } from 'mongoose';
import { INutrition } from './nutrition.schema';

export interface IMealFood {
  food_id: Types.ObjectId;
  quantity: number; // multiplier of the base food
}

export interface IMeal extends Document {
  name: string;
  foods: IMealFood[];
  total_nutrition: INutrition;
}

const MealFoodSchema = new Schema<IMealFood>({
  food_id: { type: Schema.Types.ObjectId, ref: 'Food', required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const MealSchema = new Schema<IMeal>({
  name: { type: String, required: true },
  foods: { type: [MealFoodSchema], required: true },
  total_nutrition: {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    fat: { type: Number, required: true },
    carbs: { type: Number, required: true },
  },
});

export default mongoose.model<IMeal>('Meal', MealSchema);
