import { getMeals, addMeal, deleteMeals, deleteMeal } from "@/utils/api/meals";
import { MealSchema, type MealModel } from "@/types/Meal";
import { useEffect, useState } from "react";
import {
	Card,
	//CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
//import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Cookie } from "lucide-react";
import { ReusableFormDialog } from "@/components/dialogs/ReusableFormDialog";
import { z } from "zod";
export const MealList = () => {
	const [meals, setMeals] = useState<MealModel[]>([]);
	const refresh = async () => {
		const res = await getMeals();
		setMeals(res);
	};
	useEffect(() => {
		refresh();
	}, []);
	const addSubmit = (data: z.infer<typeof MealSchema>) => {
		console.log("Adding meal : " + data.title);
		addMeal(data);
	};
	return (
		<>
			{meals ? (
				meals.length > 0 ? (
					<div className="grid md:grid-cols-3 gap-4">
						{meals.map((item) => (
							<Card key={item._id} className="border">
								<CardHeader>
									<CardTitle>{item.title}</CardTitle>
								</CardHeader>
								<CardFooter className="flex flex-col gap-2">
									<Button
										variant="destructive"
										onClick={async () => {
											await deleteMeal(item._id);
											refresh();
										}}
									>
										Delete
									</Button>
									<ReusableFormDialog
										trigger={
											<Button variant="secondary">Edit</Button>
										}
										title="Edit Meal"
										schema={MealSchema}
										onSubmit={addSubmit}
									/>

									{/* <Button variant="default" onClick={addIngredient}>
                                Add Ingredient
                            </Button> */}
								</CardFooter>
							</Card>
						))}
					</div>
				) : (
					<Alert>
						<Cookie />
						<AlertTitle>No meals found!</AlertTitle>
						<AlertDescription>
							A funny little goblin must have ate all the food.
						</AlertDescription>
					</Alert>
				)
			) : (
				<>
					<Spinner size={"lg"} />
				</>
			)}

			<Separator />

			<div className="space-y-4">
				<ReusableFormDialog
					trigger={<Button>Add Meal</Button>}
					title="Add Meal"
					schema={MealSchema}
					onSubmit={addSubmit}
				/>

				<Button
					variant="destructive"
					className="w-full"
					onClick={async () => {
						await deleteMeals();
						refresh();
					}}
				>
					Delete All Meals
				</Button>
			</div>
		</>
	);
};
