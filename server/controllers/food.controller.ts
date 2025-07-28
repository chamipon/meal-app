import { Request, Response } from "express";
import Food from "../schemas/food.schema";
import CNFService from "../services/cnf.service";
class FoodController {
	static async getAllFoods(req: Request, res: Response): Promise<void> {
		try {
			const foods = await Food.find();
			const item = await CNFService.getFood(668);
			//console.log(item);
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
				const food = new Food({
					title: foodData.title,
					ingredients: foodData.ingredients,
				});
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

export default FoodController;
