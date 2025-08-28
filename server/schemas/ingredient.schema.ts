// models/Ingredient.ts
import mongoose, { Document, Schema } from "mongoose";

// CNF Nutrient structure
export interface ICNFNutrient {
	food_code: number;
	nutrient_value: number;
	standard_error?: number;
	number_observation?: number;
	nutrient_name_id: number;
	nutrient_web_name?: string;
	nutrient_source_id?: number;
	nutrient_name?: {
		nutrient_name_id: number;
		nutrient_symbol: string;
		nutrient_name: string;
		unit: string;
		nutrient_code: number;
		tagname?: string;
		nutrient_decimals: number;
		nutrient_web_order: number;
		nutrient_web_name: string;
		nutrient_group_id: number;
	};
}

export const CNFNutrientSchema = new Schema<ICNFNutrient>({
	food_code: { type: Number, required: true },
	nutrient_value: { type: Number, required: true },
	standard_error: { type: Number },
	number_observation: { type: Number },
	nutrient_name_id: { type: Number, required: true },
	nutrient_web_name: { type: String },
	nutrient_source_id: { type: Number },
	nutrient_name: {
		type: {
			nutrient_name_id: { type: Number, required: true },
			nutrient_symbol: { type: String, required: true },
			nutrient_name: { type: String, required: true },
			unit: { type: String, required: true },
			nutrient_code: { type: Number, required: true },
			tagname: { type: String },
			nutrient_decimals: { type: Number, required: true },
			nutrient_web_order: { type: Number, required: true },
			nutrient_web_name: { type: String, required: true },
			nutrient_group_id: { type: Number, required: true },
		},
	},
});

export interface IIngredient extends Document {
	// Food identification (food_code optional for manual entries)
	food_code?: number;
	food_description: string;

	// Food categorization (from CNF)
	food_group_id?: number;
	food_group_name?: string;

	// Additional metadata
	source: "cnf" | "manual";
	created_at: Date;
	updated_at: Date;

	// Nutritional data - unified structure based on CNF format
	nutrients: ICNFNutrient[];
}

const IngredientSchema = new Schema<IIngredient>({
	// Food identification
	food_code: { type: Number, sparse: true }, // Optional for manual entries
	food_description: { type: String, required: true },

	// Food categorization
	food_group_id: { type: Number },
	food_group_name: { type: String },

	// Metadata
	source: { type: String, enum: ["cnf", "manual"], default: "manual" },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },

	// Nutritional data using CNF structure
	nutrients: { type: [CNFNutrientSchema], default: [] },
});

// Validation and pre-save hooks
IngredientSchema.pre("save", function () {
	// CNF ingredients should have a food_code
	if (this.source === "cnf" && !this.food_code) {
		throw new Error("CNF ingredients must have a food_code");
	}

	// All ingredients must have a description
	if (!this.food_description) {
		throw new Error("All ingredients must have a food_description");
	}

	// Update timestamp
	this.updated_at = new Date();
});

export default mongoose.model<IIngredient>("Ingredient", IngredientSchema);
