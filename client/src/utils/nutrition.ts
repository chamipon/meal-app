import type { CNFNutrient } from '../types/CNFNutrient.js';
import type { IngredientModel } from '../types/Ingredient.js';

// Common nutrient codes from CNF database
export const NUTRIENT_CODES = {
  ENERGY_KCAL: 208,
  PROTEIN: 203, 
  TOTAL_FAT: 204,
  CARBOHYDRATE: 205,
  FIBER: 291,
  SUGARS_TOTAL: 269,
  CALCIUM: 301,
  IRON: 303,
  SODIUM: 307,
  VITAMIN_C: 401,
} as const;

// Extract specific nutrient value by code
export function getNutrientValue(nutrients: CNFNutrient[], code: number): number | null {
  const nutrient = nutrients.find(n => n.nutrient_name?.nutrient_code === code);
  return nutrient ? nutrient.nutrient_value : null;
}

// Get basic nutrition facts from CNF nutrients
export function getBasicNutrition(nutrients: CNFNutrient[]) {
  return {
    calories: getNutrientValue(nutrients, NUTRIENT_CODES.ENERGY_KCAL) || 0,
    protein: getNutrientValue(nutrients, NUTRIENT_CODES.PROTEIN) || 0,
    fat: getNutrientValue(nutrients, NUTRIENT_CODES.TOTAL_FAT) || 0,
    carbs: getNutrientValue(nutrients, NUTRIENT_CODES.CARBOHYDRATE) || 0,
    fiber: getNutrientValue(nutrients, NUTRIENT_CODES.FIBER) || 0,
    sodium: getNutrientValue(nutrients, NUTRIENT_CODES.SODIUM) || 0,
  };
}

// Format nutrient value with proper units and decimals
export function formatNutrientValue(nutrient: CNFNutrient): string {
  if (!nutrient.nutrient_name) {
    return `${nutrient.nutrient_value}`;
  }
  
  const { nutrient_value } = nutrient;
  const { unit, nutrient_decimals } = nutrient.nutrient_name;
  
  const formattedValue = nutrient_decimals === 0 
    ? Math.round(nutrient_value).toString()
    : nutrient_value.toFixed(nutrient_decimals);
    
  return `${formattedValue} ${unit}`;
}

// Group nutrients by their nutrient group
export function groupNutrientsByGroup(nutrients: CNFNutrient[]) {
  const groups: Record<number, { name: string; nutrients: CNFNutrient[] }> = {};
  
  nutrients.forEach(nutrient => {
    if (!nutrient.nutrient_name) return;
    
    const groupId = nutrient.nutrient_name.nutrient_group_id;
    if (!groups[groupId]) {
      groups[groupId] = {
        name: getGroupName(groupId),
        nutrients: []
      };
    }
    groups[groupId].nutrients.push(nutrient);
  });
  
  // Sort nutrients within each group by web order
  Object.values(groups).forEach(group => {
    group.nutrients.sort((a, b) => 
      (a.nutrient_name?.nutrient_web_order || 0) - (b.nutrient_name?.nutrient_web_order || 0)
    );
  });
  
  return groups;
}

// Get nutrient group name by ID
function getGroupName(groupId: number): string {
  const groupNames: Record<number, string> = {
    1: 'Proximate',
    2: 'Inorganic',
    3: 'Minerals', 
    4: 'Vitamins',
    5: 'Amino Acids',
    6: 'Fatty Acids',
    7: 'Other'
  };
  return groupNames[groupId] || `Group ${groupId}`;
}

// Check if ingredient has CNF data
export function hasCNFData(ingredient: IngredientModel): boolean {
  return ingredient.source === 'cnf' && !!ingredient.food_code;
}

// Create a display name for ingredient
export function getIngredientDisplayName(ingredient: IngredientModel): string {
  return ingredient.food_description;
}

// Get main nutrients for nutrition label display
export function getMainNutrients(nutrients: CNFNutrient[]) {
  const main = getBasicNutrition(nutrients);
  
  return [
    { name: 'Calories', value: main.calories, unit: 'kcal' },
    { name: 'Protein', value: main.protein, unit: 'g' },
    { name: 'Total Fat', value: main.fat, unit: 'g' },
    { name: 'Carbohydrate', value: main.carbs, unit: 'g' },
    { name: 'Fiber', value: main.fiber, unit: 'g' },
    { name: 'Sodium', value: main.sodium, unit: 'mg' },
  ].filter(nutrient => nutrient.value > 0);
}
