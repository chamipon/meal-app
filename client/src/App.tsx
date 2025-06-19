"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	//CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Meal {
	_id: string;
	title: string;
}

interface Ingredient {
	_id: string;
	title: string;
}

export default function App() {
	const [meals, setMeals] = useState<Meal[]>([]);
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [title, setTitle] = useState<string>("");

	useEffect(() => {
		getMeals();
	}, []);

	async function getMeals() {
		const res = await fetch("http://localhost:8888/meals");
		const data = await res.json();
		setMeals(data);
	}

	async function deleteMeals() {
		await fetch("http://localhost:8888/meals", { method: "DELETE" });
		setMeals([]);
	}

	async function deleteMeal(id: string) {
		await fetch(`http://localhost:8888/meals/${id}`, { method: "DELETE" });
		setMeals(meals.filter((meal) => meal._id !== id));
	}

	async function addMeal() {
		if (!title.trim()) return;

		const res = await fetch("http://localhost:8888/meals", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title }),
		});
		const data: Meal = await res.json();
		setMeals([...meals, data]);
		setTitle("");
	}

	async function addIngredient() {
		const res = await fetch("http://localhost:8888/ingredients", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title: "ingredient" }),
		});
		const data: Ingredient = await res.json();
		setIngredients([...ingredients, data]);
	}

	return (
		<main className="max-w-4xl mx-auto p-4 space-y-6">
			<h1 className="text-3xl font-bold">Meal App</h1>
			<div className="grid md:grid-cols-3 gap-4">
				{meals.map((item) => (
					<Card key={item._id} className="border">
						<CardHeader>
							<CardTitle>{item.title}</CardTitle>
						</CardHeader>
						<CardFooter className="flex flex-col gap-2">
							<Button
								variant="destructive"
								onClick={() => deleteMeal(item._id)}
							>
								Delete
							</Button>
							<Button variant="secondary">Edit</Button>
							<Button variant="default" onClick={addIngredient}>
								Add Ingredient
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>

			<Separator />

			<div className="space-y-4">
				<Input
					placeholder="Meal Title"
					value={title}
					onChange={(value) => {
						setTitle(value.target.value);
					}}
				/>
				<Button className="w-full" onClick={addMeal}>
					Add Meal
				</Button>
				<Button
					variant="destructive"
					className="w-full"
					onClick={deleteMeals}
				>
					Delete All Meals
				</Button>
			</div>

			<Separator />

			<div>
				<h2 className="text-xl font-semibold">Ingredients</h2>
				<ul className="list-disc list-inside">
					{ingredients.map((item) => (
						<li key={item._id}>{item.title}</li>
					))}
				</ul>
			</div>
		</main>
	);
}
