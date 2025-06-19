import {
	getIngredients,
	addIngredient,
	deleteIngredients,
	deleteIngredient,
} from "@/utils/api/ingredients";
import type { Ingredient } from "@/types/Ingredient";
import { useEffect, useState } from "react";
import {
	Card,
	//CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
export const IngredientList = () => {
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [title, setTitle] = useState<string>("");
	const refresh = async () => {
		const res = await getIngredients();
		setIngredients(res);
	};
	useEffect(() => {
		refresh();
	}, []);
	return (
		<>
			<div className="grid md:grid-cols-3 gap-4">
				{ingredients &&
					ingredients.map((item) => (
						<Card key={item._id} className="border">
							<CardHeader>
								<CardTitle>{item.title}</CardTitle>
							</CardHeader>
							<CardFooter className="flex flex-col gap-2">
								<Button
									variant="destructive"
									onClick={async () => {
										await deleteIngredient(item._id);
										refresh();
									}}
								>
									Delete
								</Button>
								<Button variant="secondary">Edit</Button>
							</CardFooter>
						</Card>
					))}
			</div>
			<Separator />
			<div className="space-y-4">
				<Input
					placeholder="Ingredient Title"
					value={title}
					onChange={(value) => {
						setTitle(value.target.value);
					}}
				/>
				<Button
					className="w-full"
					onClick={async () => {
						await addIngredient(title);
						refresh();
						setTitle("");
					}}
				>
					Add Ingredient
				</Button>
				<Button
					variant="destructive"
					className="w-full"
					onClick={async () => {
						await deleteIngredients();
						refresh();
					}}
				>
					Delete All Ingredients
				</Button>
			</div>
		</>
	);
};
