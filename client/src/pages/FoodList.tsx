import {
	getFoods,
	addFood,
	deleteFoods,
	deleteFood,
	editFood,
} from "@/utils/api/foods";
import { type FoodModel, CreateFoodSchema, FoodSchema } from "@/types/Food";
import { useEffect, useState } from "react";
import {
	Card,
	//CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReusableFormDialog } from "@/components/dialogs/ReusableFormDialog";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
export const FoodList = () => {
	const [foods, setFoods] = useState<FoodModel[]>([]);
	const refresh = async () => {
		const res = await getFoods();
		setFoods(res);
	};
	const addSubmit = (data: z.infer<typeof CreateFoodSchema>) => {
		console.log("[INFO] Adding food : " + data.title);
		addFood(data);
	};
	const editSubmit = (data: z.infer<typeof FoodSchema>) => {
		console.log("[INFO] Editing food : " + data);
		if (!data._id) console.error("[ERROR] Missing food ID");
		else editFood(data._id, data);
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
								<ReusableFormDialog
									trigger={<Button>Edit Ingredient</Button>}
									title="Edit Ingredient"
									schema={FoodSchema}
									onSubmit={editSubmit}
									defaultValues={
										item as z.infer<typeof FoodSchema>
									}
								/>
							</CardFooter>
						</Card>
					))}
			</div>
			<Separator />
			<div className="space-y-4">
				<ReusableFormDialog
					trigger={<Button>Add Food</Button>}
					title="Add Food"
					schema={CreateFoodSchema}
					onSubmit={addSubmit}
				/>
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
