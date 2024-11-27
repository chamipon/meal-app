const { getPool } = require("../postgresql");

class MealController {
	static async getAllMeals(req, res) {
		try {
			const result = await getPool().query("SELECT * FROM meals");
			res.status(200).send(result.rows);
		} catch (err) {
			console.error("Error executing query", err);
			res.status(500).send(err);
		}
	}
	static async getMeal(req, res) {
		var id = req.params.id;
		try {
			const result = await getPool().query(
				`SELECT * FROM meals WHERE id = ${id}`
			);
			if (result.rows.length == 0) {
				res.status(404).send("No meal found with id " + id);
				console.log("No meal found with id " + id);
			} else {
				console.log(result.rows[0]);
				res.status(200).send(result.rows[0]);
			}
		} catch (err) {
			console.error("Error executing query", err);
			res.status(500).send(err);
		}
	}
	static async addMeal(req, res) {
		var meal = req.body;

		if (meal && meal.title) {
			try {
				const result = await getPool().query(
					"INSERT INTO meals(title,created_at) VALUES($1, $2) RETURNING *",
					[meal.title, new Date()]
				);
				console.log("Meal created:", result.rows[0]);
				res.status(201).send(result.rows[0]);
			} catch (err) {
				console.error("Error querying the postgres pool: ", err);
				res.status(500).send(err);
			}
		} else {
			res.status(400).send("Invalid request body");
			console.error("Invalid request");
		}
	}

	static async deleteAllMeals(req, res) {
		try {
			const result = await getPool().query("DELETE FROM meals");
			res.status(200).send(result.rows);
		} catch (err) {
			console.error("Error executing query", err);
			res.status(500).send(err);
		}
	}
	static async deleteMeal(req, res) {
		var id = req.params.id;
		try {
			const result = await getPool().query(
				`DELETE FROM meals WHERE id = ${id} RETURNING *`
			);
			if (result.rows.length == 0) {
				res.status(404).send("No meal found with id " + id);
				console.log("No meal found with id " + id);
			} else {
				res.status(204).send(result.rows);
				console.log("Meal deleted:", id);
			}
		} catch (err) {
			console.error("Error executing query", err);
			res.status(500).send(err);
		}
	}
}

module.exports = MealController;
