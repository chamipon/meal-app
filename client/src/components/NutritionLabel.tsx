import { type IngredientModel } from '../types/Ingredient.js';
import { getBasicNutrition, getMainNutrients, hasCNFData } from '../utils/nutrition';

interface NutritionLabelProps {
  ingredient: IngredientModel;
}

export function NutritionLabel({ ingredient }: NutritionLabelProps) {
  const mainNutrients = getMainNutrients(ingredient.nutrients);
  const isCNFData = hasCNFData(ingredient);

  if (mainNutrients.length === 0) {
    return (
      <div className="nutrition-label">
        <h3>{ingredient.food_description}</h3>
        <p>No nutritional data available</p>
      </div>
    );
  }

  return (
    <div className="nutrition-label">
      <h3>{ingredient.food_description}</h3>
      {isCNFData && (
        <p className="cnf-badge">Canadian Nutrient File Data</p>
      )}
      
      <div className="nutrition-facts">
        <h4>Nutrition Facts</h4>
        <div className="nutrient-list">
          {mainNutrients.map((nutrient, index) => (
            <div key={index} className="nutrient-row">
              <span className="nutrient-name">{nutrient.name}</span>
              <span className="nutrient-value">
                {nutrient.value.toFixed(1)} {nutrient.unit}
              </span>
            </div>
          ))}
        </div>
        
        {ingredient.nutrients.length > mainNutrients.length && (
          <p className="additional-info">
            + {ingredient.nutrients.length - mainNutrients.length} more nutrients available
          </p>
        )}
      </div>
    </div>
  );
}

// Example usage with basic nutrition extraction
export function BasicNutritionDisplay({ ingredient }: NutritionLabelProps) {
  const nutrition = getBasicNutrition(ingredient.nutrients);
  
  return (
    <div className="basic-nutrition">
      <h4>{ingredient.food_description}</h4>
      <div className="nutrition-grid">
        <div>Calories: {nutrition.calories}</div>
        <div>Protein: {nutrition.protein}g</div>
        <div>Fat: {nutrition.fat}g</div>
        <div>Carbs: {nutrition.carbs}g</div>
      </div>
    </div>
  );
}
