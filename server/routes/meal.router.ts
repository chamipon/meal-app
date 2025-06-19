import { Router } from "express";
import MealController from "../controllers/meal.controller";

const router = Router();

router.get("/", MealController.getAllMeals);
router.get("", MealController.getAllMeals);
router.get("/:id", MealController.getMeal);
router.post("/", MealController.addMeal);
router.delete("/", MealController.deleteAllMeals);
router.delete("/:id", MealController.deleteMeal);

export default router;
