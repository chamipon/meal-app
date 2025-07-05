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
import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";
export const IngredientList = () => {
	const [ingredients, setIngredients] = useState<IngredientModel[]>([]);
	const refresh = async () => {
		const res = await getIngredients();
		setIngredients(res);
	};
	const addSubmit = async (data: z.infer<typeof CreateIngredientSchema>) => {
		console.log("[INFO] Adding ingredient", data);
		return await addIngredient(data);
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
								<ConfirmationDialog
									trigger={
										<Button variant="destructive">
											Delete Ingredient
										</Button>
									}
									title="Delete Ingredient"
									description={`Are you sure you want to delete \"${item.name}\"? This action cannot be undone.`}
									onConfirm={async () => {
										await deleteIngredient(item._id);
										refresh();
									}}
								/>
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
			<div className="space-x-4">
				<ReusableFormDialog
					trigger={<Button>Add Ingredient</Button>}
					title="Add Ingredient"
					schema={CreateIngredientSchema}
					onSubmit={addSubmit}
				/>
				<ConfirmationDialog
					trigger={
						<Button variant="destructive">
							Delete All Ingredients
						</Button>
					}
					title="Delete All Ingredients"
					description={`Are you sure you want to delete ALL ingredients? This action cannot be undone.`}
					onConfirm={async () => {
						await deleteIngredients();
						refresh();
					}}
				/>
			</div>
		</>
	);
};
