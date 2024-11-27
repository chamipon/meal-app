CREATE TABLE "meals" (
  "id" SERIAL PRIMARY KEY,
  "title" varchar,
  "food_ids" int[],
  "created_at" timestamp
);

CREATE TABLE "ingredients" (
  "id" integer PRIMARY KEY,
  "title" varchar,
  "created_at" timestamp
);

CREATE TABLE "foods" (
  "id" integer PRIMARY KEY,
  "title" varchar,
  "ingredient_ids" int[]
);

COMMENT ON COLUMN "meals"."food_ids" IS 'Food items in the meal';

COMMENT ON COLUMN "foods"."ingredient_ids" IS 'Ingredients in the food';

CREATE TABLE "meals_foods" (
  "meals_food_ids" int[],
  "foods_id" integer,
  PRIMARY KEY ("meals_food_ids", "foods_id")
);

ALTER TABLE "meals_foods" ADD FOREIGN KEY ("meals_food_ids") REFERENCES "meals" ("food_ids");

ALTER TABLE "meals_foods" ADD FOREIGN KEY ("foods_id") REFERENCES "foods" ("id");


CREATE TABLE "ingredients_foods" (
  "ingredients_id" integer,
  "foods_ingredient_ids" int[],
  PRIMARY KEY ("ingredients_id", "foods_ingredient_ids")
);

ALTER TABLE "ingredients_foods" ADD FOREIGN KEY ("ingredients_id") REFERENCES "ingredients" ("id");

ALTER TABLE "ingredients_foods" ADD FOREIGN KEY ("foods_ingredient_ids") REFERENCES "foods" ("ingredient_ids");

