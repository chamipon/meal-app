import { Router } from "express";
import FoodController from "../controllers/food.controller";

const router = Router();

router.get("/", FoodController.getAllFoods);
router.get("", FoodController.getAllFoods);
router.get("/:id", FoodController.getFood);
router.post("/", FoodController.addFood);
router.delete("/", FoodController.deleteAllFoods);
router.delete("/:id", FoodController.deleteFood);
router.patch("/:id", FoodController.editFood);
export default router;
