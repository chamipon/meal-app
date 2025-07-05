import { z } from 'zod';

// Define the Zod enum
export const UnitEnum = z.enum([
  'g',    // Gram
  'kg',   // Kilogram
  'L',    // Liter
  'mL',   // Milliliter
  'pcs',  // Piece
  'cup',  // Cup
  'tbsp', // Tablespoon
  'tsp',  // Teaspoon
  'oz',   // Ounce
  'lb',   // Pound
]);

// Inferred type from Zod enum
export type Unit = z.infer<typeof UnitEnum>;
