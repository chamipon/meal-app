import Ingredient from "../schemas/ingredient.schema.js";
import { createLogger } from "../utils/logger.js";
const logger = createLogger("INGREDIENT_SERVICE");

class IngredientService {
	static getIngredient = async (id: string) => {
		const ingredient = await Ingredient.findById(id);
		if (!ingredient) {
			logger.error(`No ingredient found with id ${id}`);
			throw new Error(`No ingredient found with id ${id}`);
		} else {
			return ingredient;
		}
	};
}

export default IngredientService;
