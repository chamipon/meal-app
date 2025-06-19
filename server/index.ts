import dotenv from "dotenv";
import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

import mealRouter from "./routes/meal.router";
import ingredientRouter from "./routes/ingredient.router";

dotenv.config();

const app: Express = express();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const MONGO_DB = process.env.MONGO_DB || "meal-app";
const PORT = process.env.API_PORT || 8888;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/ingredients", ingredientRouter);
app.use("/meals", mealRouter);

// MongoDB Connection
console.log(`Attempting mongo connection ${MONGO_URI}`);
mongoose
	.connect(`${MONGO_URI}`)
	.then(() => {
		console.log("Connected to MongoDB");
		app.listen(PORT, () => {
			console.log(`App listening: ${PORT}`);
		});
	})
	.catch((err) => {
		console.error("MongoDB connection error:", err);
	});
