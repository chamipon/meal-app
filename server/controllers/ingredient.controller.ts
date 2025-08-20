import { Request, Response } from "express";
import Ingredient from "../schemas/ingredient.schema.js";
import CNFService from "../services/cnf.service.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("INGREDIENT_CONTROLLER");

class IngredientController {
	static async getAllIngredients(req: Request, res: Response): Promise<void> {
		try {
			const ingredients = await Ingredient.find();
			res.status(200).json(ingredients);
		} catch (err) {
			console.error("Error fetching ingredients", err);
			res.status(500).send(err);
		}
	}

	static async getIngredient(req: Request, res: Response): Promise<void> {
		const id = req.params.id;
		try {
			const ingredient = await Ingredient.findById(id);
			if (!ingredient) {
				res.status(404).send(`No ingredient found with id ${id}`);
				console.log(`No ingredient found with id ${id}`);
			} else {
				res.status(200).json(ingredient);
			}
		} catch (err) {
			console.error("Error fetching ingredient", err);
			res.status(500).send(err);
		}
	}

	static async addIngredient(req: Request, res: Response): Promise<void> {
		const { food_description, nutrients, food_group_id, food_group_name } = req.body;

		if (!food_description) {
			res.status(400).send("Invalid request body: 'food_description' is required");
			logger.error("Invalid request body - missing food_description");
			return;
		}

		try {
			const newIngredient = new Ingredient({ 
				food_description, 
				nutrients: nutrients || [],
				food_group_id,
				food_group_name,
				source: 'manual'
			});
			const savedIngredient = await newIngredient.save();
			logger.success(`Manual ingredient created: ${food_description}`);
			res.status(201).json(savedIngredient);
		} catch (err) {
			logger.error("Error saving ingredient", err);
			res.status(500).send(err);
		}
	}

	static async deleteAllIngredients(req: Request, res: Response): Promise<void> {
		try {
			const result = await Ingredient.deleteMany({});
			res.status(200).json({ deletedCount: result.deletedCount });
		} catch (err) {
			console.error("Error deleting ingredients", err);
			res.status(500).send(err);
		}
	}

	static async deleteIngredient(req: Request, res: Response): Promise<void> {
		const id = req.params.id;
		try {
			const deleted = await Ingredient.findByIdAndDelete(id);
			if (!deleted) {
				res.status(404).send(`No ingredient found with id ${id}`);
				console.log(`No ingredient found with id ${id}`);
			} else {
				res.status(204).send();
				console.log("Ingredient deleted:", id);
			}
		} catch (err) {
			console.error("Error deleting ingredient", err);
			res.status(500).send(err);
		}
	}

	static async editIngredient(req: Request, res: Response): Promise<void> {
		const id = req.params.id;
		const { food_description, nutrients, food_group_id, food_group_name } = req.body;

		try {
			const updateData: any = {};
			if (food_description !== undefined) updateData.food_description = food_description;
			if (nutrients !== undefined) updateData.nutrients = nutrients;
			if (food_group_id !== undefined) updateData.food_group_id = food_group_id;
			if (food_group_name !== undefined) updateData.food_group_name = food_group_name;
			
			const updated = await Ingredient.findByIdAndUpdate(
				id,
				updateData,
				{ new: true, runValidators: true }
			);

			if (!updated) {
				res.status(404).send(`No ingredient found with id ${id}`);
				logger.warn(`No ingredient found with id ${id}`);
			} else {
				logger.success(`Ingredient updated: ${updated.food_description}`);
				res.status(200).json(updated);
			}
		} catch (err) {
			logger.error("Error updating ingredient", err);
			res.status(500).send(err);
		}
	}

	// CNF Integration Methods
	static async populateFromCNF(req: Request, res: Response): Promise<void> {
		const { limit = 100, nutrient_groups } = req.query;
		
		try {
			logger.log(`Starting CNF population with limit: ${limit}`);
			
			// Get foods from CNF
			const cnfFoods = await CNFService.getFoodList();
			const foodsToProcess = cnfFoods.slice(0, Number(limit));
			
			logger.log(`Processing ${foodsToProcess.length} foods from CNF`);
			
			const results = {
				processed: 0,
				saved: 0,
				skipped: 0,
				errors: 0
			};
			
			// Process foods in batches to avoid overwhelming the API
			const batchSize = 10;
			for (let i = 0; i < foodsToProcess.length; i += batchSize) {
				const batch = foodsToProcess.slice(i, i + batchSize);
				const batchPromises = batch.map(async (food: any) => {
					try {
						results.processed++;
						
						// Check if ingredient already exists
						const existing = await Ingredient.findOne({ 
							food_code: food.food_code,
							source: 'cnf' 
						});
						
						if (existing) {
							results.skipped++;
							return;
						}
						
						// Get detailed food data with nutrients
						const detailedFood = await CNFService.getFood(
							food.food_code,
							nutrient_groups ? 
								(Array.isArray(nutrient_groups) ? nutrient_groups.map(Number) : [Number(nutrient_groups)]) 
								: undefined
						);
						
						// Create new ingredient
						const newIngredient = new Ingredient({
							food_code: detailedFood.food_code,
							food_description: detailedFood.food_description,
							source: 'cnf',
							nutrients: detailedFood.nutrients || []
						});
						
						await newIngredient.save();
						results.saved++;
						
					} catch (error) {
						logger.error(`Error processing food ${food.food_code}:`, error);
						results.errors++;
					}
				});
				
				await Promise.all(batchPromises);
				
				// Small delay between batches to be respectful to the API
				if (i + batchSize < foodsToProcess.length) {
					await new Promise(resolve => setTimeout(resolve, 1000));
				}
			}
			
			logger.success(`CNF population completed: ${JSON.stringify(results)}`);
			res.status(200).json({
				message: 'CNF population completed',
				results
			});
			
		} catch (error) {
			logger.error("Error populating from CNF:", error);
			res.status(500).json({ error: 'Failed to populate from CNF' });
		}
	}

	static async getCNFFoodsList(req: Request, res: Response): Promise<void> {
		try {
			logger.log("Fetching CNF foods list");
			const foods = await CNFService.getFoodList();
			res.status(200).json({
				count: foods.length,
				foods: foods
			});
		} catch (error) {
			logger.error("Error fetching CNF foods list:", error);
			res.status(500).json({ error: 'Failed to fetch CNF foods list' });
		}
	}

	static async addCNFIngredient(req: Request, res: Response): Promise<void> {
		const { food_code, nutrient_groups } = req.body;
		
		if (!food_code) {
			res.status(400).json({ error: 'food_code is required' });
			return;
		}
		
		try {
			// Check if ingredient already exists
			const existing = await Ingredient.findOne({ 
				food_code: Number(food_code),
				source: 'cnf' 
			});
			
			if (existing) {
				res.status(409).json({ 
					error: 'CNF ingredient already exists',
					ingredient: existing 
				});
				return;
			}
			
			// Get detailed food data
			const detailedFood = await CNFService.getFood(
				Number(food_code),
				nutrient_groups
			);
			
			// Create new ingredient
			const newIngredient = new Ingredient({
				food_code: detailedFood.food_code,
				food_description: detailedFood.food_description,
				source: 'cnf',
				nutrients: detailedFood.nutrients || []
			});
			
			const savedIngredient = await newIngredient.save();
			logger.success(`CNF ingredient added: ${detailedFood.food_description}`);
			
			res.status(201).json(savedIngredient);
			
		} catch (error) {
			logger.error(`Error adding CNF ingredient ${food_code}:`, error);
			res.status(500).json({ error: 'Failed to add CNF ingredient' });
		}
	}
}

export default IngredientController;
