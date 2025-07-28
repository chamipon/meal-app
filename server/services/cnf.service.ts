import axios from "axios";
import { createLogger } from "../utils/logger";

const logger = createLogger("CNF_SERVICE");
const CNF_BASE_URL = "https://food-nutrition.canada.ca/api/canadian-nutrient-file";

class CNFService {
	static getFoodList = async () => {
		logger.log("Fetching full food list");
		try {
			const res = await axios.get(`${CNF_BASE_URL}/food?lang=en&type=json`);
			const foods = res.data;
			logger.success(`Fetched food list, total items: ${foods.length}`);
			return foods;
		} catch (error) {
			logger.error("Failed to fetch food list", error);
			throw error;
		}
	};

	static getFood = async (food_code: number, nutrient_groups?: number[]) => {
		logger.log(`Fetching food ${food_code}`);
		try {
			const foodRes = await axios.get(
				`${CNF_BASE_URL}/food?lang=en&type=json&id=${food_code}`
			);
			const food = foodRes.data[0];

			if (!food) {
				const message = `No food found for id ${food_code}`;
				logger.error(message);
				throw new Error(message);
			}
			logger.success(`Food found for id ${food_code}`);

			let nutrients;
			try {
				nutrients = await this.getNutrients(food_code);
				logger.success(
					`Nutrients fetched for food ${food_code}, count: ${nutrients.length}`
				);
			} catch (error) {
				const message = `Error fetching nutrients for food ${food_code}`;
				logger.error(message, error);
				throw error;
			}

			// Enrich nutrients with nutrient names in parallel
			const enrichedNutrients = await Promise.all(
				nutrients.map(async (el) => {
					try {
						const nutrient_name = await this.getNutrientName(
							el.nutrient_name_id
						);
						if (
							!nutrient_groups ||
							nutrient_groups.includes(nutrient_name.nutrient_group_id)
						) {
							return {
								...el,
								nutrient_name,
							};
						}
					} catch (err) {
						logger.warn(
							`Failed to fetch nutrient name for ID ${el.nutrient_name_id}`
						);
					}
					return null; // filtered or failed
				})
			);

			nutrients = enrichedNutrients.filter(Boolean) as typeof nutrients;
			logger.log(`Filtered Nutrient Count: ${nutrients.length}`);

			food.nutrients = nutrients;
			return food;
		} catch (error) {
			const message = `Error fetching food ${food_code}`;
			logger.error(message, error);
			throw error;
		}
	};

	static getNutrients = async (food_code: number) => {
		logger.log(`Fetching nutrients for food ${food_code}`);
		try {
			const res = await axios.get(
				`${CNF_BASE_URL}/nutrientamount?lang=en&type=json&id=${food_code}`
			);
			const nutrients = res.data;
			logger.success(
				`Fetched ${nutrients.length} nutrients for food ${food_code}`
			);
			return nutrients;
		} catch (error) {
			logger.error(`Failed to fetch nutrients for food ${food_code}`, error);
			throw error;
		}
	};

	static getNutrientGroups = async (groups?: number[]) => {
		logger.log("Fetching nutrient groups");
		try {
			const requested_groups = groups;
			const res = await axios.get(
				`${CNF_BASE_URL}/nutrientgroup?lang=en&type=json`
			);
			const nutrient_groups = res.data;

			logger.success(
				`Fetched nutrient groups, count: ${nutrient_groups.length}`
			);
			return nutrient_groups;
		} catch (error) {
			logger.error("Failed to fetch nutrient groups", error);
			throw error;
		}
	};

	static getNutrientName = async (nutrient_code: number) => {
		logger.log(`Fetching nutrient name for nutrient_code ${nutrient_code}`);
		try {
			const res = await axios.get(
				`${CNF_BASE_URL}/nutrientname?lang=en&type=json&id=${nutrient_code}`
			);
			const nutrient_name = res.data;
			logger.success(
				`Fetched nutrient name for nutrient_code ${nutrient_code}`
			);
			return nutrient_name;
		} catch (error) {
			logger.error(
				`Failed to fetch nutrient name for nutrient_code ${nutrient_code}`,
				error
			);
			throw error;
		}
	};
}

export default CNFService;
