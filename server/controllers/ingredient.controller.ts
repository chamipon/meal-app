import { Request, Response } from "express";
import { Ingredient } from "../schemas/ingredient.schema";

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
		const { name, amount } = req.body;

		if (!name) {
			res.status(400).send("Invalid request body: 'name' is required");
			console.error("Invalid request body");
			return;
		}

		try {
			const newIngredient = new Ingredient({ name, amount });
			const savedIngredient = await newIngredient.save();
			console.log("Ingredient created:", savedIngredient);
			res.status(201).json(savedIngredient);
		} catch (err) {
			console.error("Error saving ingredient", err);
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
		const { name, amount } = req.body;

		try {
			const updated = await Ingredient.findByIdAndUpdate(
				id,
				{ name, amount },
				{ new: true, runValidators: true }
			);

			if (!updated) {
				res.status(404).send(`No ingredient found with id ${id}`);
				console.log(`No ingredient found with id ${id}`);
			} else {
				console.log("Ingredient updated:", updated);
				res.status(200).json(updated);
			}
		} catch (err) {
			console.error("Error updating ingredient", err);
			res.status(500).send(err);
		}
	}
}

export default IngredientController;
