import { Router } from "express";
import IngredientController from "../controllers/ingredient.controller.js";

const router = Router();

// Standard CRUD routes
router.get("/", IngredientController.getAllIngredients);
router.get("", IngredientController.getAllIngredients);
router.get("/:id", IngredientController.getIngredient);
router.post("/", IngredientController.addIngredient);
router.delete("/", IngredientController.deleteAllIngredients);
router.delete("/:id", IngredientController.deleteIngredient);
router.put("/:id", IngredientController.editIngredient);

// CNF Integration routes
router.post("/cnf/populate", IngredientController.populateFromCNF);
router.get("/cnf/foods", IngredientController.getCNFFoodsList);
router.post("/cnf/add", IngredientController.addCNFIngredient);

export default router;
