import {
	getIngredients,
	addIngredient,
	deleteIngredients,
	deleteIngredient,
	editIngredient,
} from "@/utils/api/ingredients";
import {
	CreateIngredientSchema,
	IngredientSchema,
	type IngredientModel,
} from "@/types/Ingredient";
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
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
export const IngredientList = () => {
	const [ingredients, setIngredients] = useState<IngredientModel[]>([]);
	const refresh = async () => {
		const res = await getIngredients();
		setIngredients(res);
	};
	const addSubmit = (data: z.infer<typeof CreateIngredientSchema>) => {
		console.log("[INFO] Adding ingredient", data);
		addIngredient(data);
	};
	const editSubmit = (data: z.infer<typeof IngredientSchema>) => {
		console.log("[INFO] Editing ingredient", data);
		if (!data._id) console.error("[ERROR] Missing ingredient ID");
		else editIngredient(data._id, data);
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
								<CardTitle>{item.name}</CardTitle>
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
								<ReusableFormDialog
									trigger={<Button>Edit Ingredient</Button>}
									title="Edit Ingredient"
									schema={IngredientSchema}
									onSubmit={editSubmit}
									defaultValues={
										item as z.infer<typeof IngredientSchema>
									}
								/>
							</CardFooter>
						</Card>
					))}
			</div>
			<Separator />
			<div className="space-y-4">
				<ReusableFormDialog
					trigger={<Button>Add Ingredient</Button>}
					title="Add Ingredient"
					schema={CreateIngredientSchema}
					onSubmit={addSubmit}
				/>
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
