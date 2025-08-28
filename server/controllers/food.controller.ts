import { Request, Response } from "express";
import Food from "../schemas/food.schema.js";
import IngredientService from "../services/ingredient.service.js";
import { ICNFNutrient } from "../schemas/ingredient.schema.js";

class FoodController {
	static async getAllFoods(req: Request, res: Response): Promise<void> {
		try {
			const foods = await Food.find();
			res.status(200).send(foods);
		} catch (err) {
			console.error("Error fetching foods", err);
			res.status(500).send(err);
		}
	}

	static async getFood(req: Request, res: Response): Promise<void> {
		const id = req.params.id;
		try {
			const food = await Food.findById(id);
			if (!food) {
				res.status(404).send(`No food found with id ${id}`);
				console.log(`No food found with id ${id}`);
			} else {
				res.status(200).send(food);
			}
		} catch (err) {
			console.error("Error fetching food", err);
			res.status(500).send(err);
		}
	}

	static async addFood(req: Request, res: Response): Promise<void> {
		const foodData = req.body;
		if (foodData && foodData.title) {
			try {
				const total_nutrition: ICNFNutrient[] =
					await calculateTotalNutrients(foodData.ingredients);
				const food = new Food({
					title: foodData.title,
					ingredients: foodData.ingredients.map(
						(ingredient_id: string) => {
							return {
								ingredient_id: ingredient_id,
								quantity: 1,
							};
						}
					),
					total_nutrition: total_nutrition,
				});
				//For each ingredient, fetch data. Sum up all nutrition information.
				const savedFood = await food.save();
				console.log("Food created:", savedFood);
				res.status(201).send(savedFood);
			} catch (err) {
				console.error("Error saving food", err);
				res.status(500).send(err);
			}
		} else {
			res.status(400).send("Invalid request body");
			console.error("Invalid request");
		}
	}

	static async deleteAllFoods(req: Request, res: Response): Promise<void> {
		try {
			const result = await Food.deleteMany({});
			res.status(200).send({ deletedCount: result.deletedCount });
		} catch (err) {
			console.error("Error deleting foods", err);
			res.status(500).send(err);
		}
	}

	static async deleteFood(req: Request, res: Response): Promise<void> {
		const id = req.params.id;
		try {
			const result = await Food.findByIdAndDelete(id);
			if (!result) {
				res.status(404).send(`No food found with id ${id}`);
				console.log(`No food found with id ${id}`);
			} else {
				res.status(204).send(); // No content
				console.log("Food deleted:", id);
			}
		} catch (err) {
			console.error("Error deleting food", err);
			res.status(500).send(err);
		}
	}
	static async editFood(req: Request, res: Response): Promise<void> {
		const id = req.params.id;
		const { title, ingredients } = req.body;

		try {
			const updated = await Food.findByIdAndUpdate(
				id,
				{ title, ingredients },
				{ new: true, runValidators: true }
			);

			if (!updated) {
				res.status(404).send(`No food found with id ${id}`);
				console.log(`No food found with id ${id}`);
			} else {
				console.log("Food updated:", updated);
				res.status(200).json(updated);
			}
		} catch (err) {
			console.error("Error updating food", err);
			res.status(500).send(err);
		}
	}
}
async function calculateTotalNutrients(
	ingredientIds: string[]
): Promise<ICNFNutrient[]> {
	const totalMap = new Map<number, ICNFNutrient>();

	for (const ingredient_id of ingredientIds) {
		const ingredient = await IngredientService.getIngredient(ingredient_id);

		for (const nutrient of ingredient.nutrients as ICNFNutrient[]) {
			const value = Number(nutrient.nutrient_value) || 0; // <-- ensure numeric

			const existing = totalMap.get(nutrient.nutrient_name_id);

			if (!existing) {
				// clone and sanitize
				totalMap.set(nutrient.nutrient_name_id, {
					...nutrient,
					nutrient_value: value,
				});
			} else {
				existing.nutrient_value += value;
			}
		}
	}

	return Array.from(totalMap.values());
}

export default FoodController;
