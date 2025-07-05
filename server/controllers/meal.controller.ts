import { Request, Response } from "express";
import Meal from "../schemas/meal.schema";

class MealController {
	static async getAllMeals(req: Request, res: Response): Promise<void> {
		try {
			const meals = await Meal.find();
			res.status(200).send(meals);
		} catch (err) {
			console.error("Error fetching meals", err);
			res.status(500).send(err);
		}
	}

	static async getMeal(req: Request, res: Response): Promise<void> {
		const id = req.params.id;
		try {
			const meal = await Meal.findById(id);
			if (!meal) {
				res.status(404).send(`No meal found with id ${id}`);
				console.log(`No meal found with id ${id}`);
			} else {
				res.status(200).send(meal);
			}
		} catch (err) {
			console.error("Error fetching meal", err);
			res.status(500).send(err);
		}
	}

	static async addMeal(req: Request, res: Response): Promise<void> {
		const mealData = req.body;

		if (mealData && mealData.title) {
			try {
				const meal = new Meal({ title: mealData.title });
				const savedMeal = await meal.save();
				console.log("Meal created:", savedMeal);
				res.status(201).send(savedMeal);
			} catch (err) {
				console.error("Error saving meal", err);
				res.status(500).send(err);
			}
		} else {
			res.status(400).send("Invalid request body");
			console.error("Invalid request");
		}
	}

	static async deleteAllMeals(req: Request, res: Response): Promise<void> {
		try {
			const result = await Meal.deleteMany({});
			res.status(200).send({ deletedCount: result.deletedCount });
		} catch (err) {
			console.error("Error deleting meals", err);
			res.status(500).send(err);
		}
	}

	static async deleteMeal(req: Request, res: Response): Promise<void> {
		const id = req.params.id;
		try {
			const result = await Meal.findByIdAndDelete(id);
			if (!result) {
				res.status(404).send(`No meal found with id ${id}`);
				console.log(`No meal found with id ${id}`);
			} else {
				res.status(204).send(); // No content
				console.log("Meal deleted:", id);
			}
		} catch (err) {
			console.error("Error deleting meal", err);
			res.status(500).send(err);
		}
	}
}

export default MealController;
