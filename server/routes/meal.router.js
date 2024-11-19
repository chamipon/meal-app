const express = require("express");
const router = express.Router();
const MealController = require("../controllers/meal.controller");

router.get("/", MealController.getAllMeals);
router.get("/:id", MealController.getMeal);
router.post("/", MealController.addMeal);
router.delete("/", MealController.deleteAllMeals);
router.delete("/:id", MealController.deleteMeal);

module.exports = router;
