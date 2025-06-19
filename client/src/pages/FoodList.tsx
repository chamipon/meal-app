import { getFoods, addFood, deleteFoods, deleteFood } from "@/utils/api/foods";
import type { Food } from "@/types/Food";
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
export const FoodList = () => {
	const [foods, setFoods] = useState<Food[]>([]);
	const [title, setTitle] = useState<string>("");
	const refresh = async () => {
		const res = await getFoods();
		setFoods(res);
	};
	useEffect(() => {
		refresh();
	}, []);
	return (
		<>
			<div className="grid md:grid-cols-3 gap-4">
				{foods &&
					foods.map((item) => (
						<Card key={item._id} className="border">
							<CardHeader>
								<CardTitle>{item.title}</CardTitle>
							</CardHeader>
							<CardFooter className="flex flex-col gap-2">
								<Button
									variant="destructive"
									onClick={async () => {
										await deleteFood(item._id);
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
					placeholder="Food Title"
					value={title}
					onChange={(value) => {
						setTitle(value.target.value);
					}}
				/>
				<Button
					className="w-full"
					onClick={async () => {
						await addFood(title);
						refresh();
						setTitle("");
					}}
				>
					Add Food
				</Button>
				<Button
					variant="destructive"
					className="w-full"
					onClick={async () => {
						await deleteFoods();
						refresh();
					}}
				>
					Delete All Foods
				</Button>
			</div>
		</>
	);
};
