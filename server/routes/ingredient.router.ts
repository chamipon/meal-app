import { Router } from "express";
import IngredientController from "../controllers/ingredient.controller";

const router = Router();

router.get("/", IngredientController.getAllIngredients);
router.get("", IngredientController.getAllIngredients);
router.get("/:id", IngredientController.getIngredient);
router.post("/", IngredientController.addIngredient);
router.delete("/", IngredientController.deleteAllIngredients);
router.delete("/:id", IngredientController.deleteIngredient);
router.put("/:id", IngredientController.editIngredient);

export default router;
