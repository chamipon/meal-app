import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodObject, ZodString, ZodNumber, ZodReadonly, ZodArray } from "zod";
import type { ZodRawShape } from "zod";
import type { ReactNode } from "react";
import type { Path, DefaultValues } from "react-hook-form";
import { IngredientMultiSelect } from "./IngredientMultiSelect";
import { getIngredients } from "@/utils/api/ingredients";
interface ReusableFormDialogProps<T extends ZodObject<ZodRawShape>> {
	schema: T;
	trigger: ReactNode;
	title: string;
	description?: string;
	defaultValues?: z.infer<T>;
	onSubmit: (data: z.infer<T>) => void;
}

export const ReusableFormDialog = <T extends ZodObject<ZodRawShape>>({
	schema,
	trigger,
	title,
	description,
	defaultValues,
	onSubmit,
}: ReusableFormDialogProps<T>) => {
	const form = useForm<z.infer<T>>({
		resolver: zodResolver(schema),
		defaultValues: defaultValues as DefaultValues<z.infer<T>>,
	});
	const shape = schema.shape;
	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && (
						<DialogDescription>{description}</DialogDescription>
					)}
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit, (e) => {
							console.log(e);
						})}
						className="space-y-4 mt-4"
					>
						{(
							Object.entries(shape) as [
								keyof z.infer<T>,
								z.ZodTypeAny
							][]
						).map(([key, fieldSchema]) => {
							if (
								fieldSchema instanceof ZodString ||
								fieldSchema instanceof ZodNumber ||
								fieldSchema instanceof ZodReadonly
							) {
								return (
									<FormField
										key={String(key)}
										control={form.control}
										name={key as Path<z.infer<T>>}
										render={({ field }) => (
											<FormItem>
												<FormLabel className="capitalize">
													{String(key)}
												</FormLabel>
												<FormControl>
													<Input
														disabled={
															fieldSchema instanceof
															ZodReadonly
														}
														type={
															fieldSchema instanceof
															ZodNumber
																? "number"
																: "text"
														}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								);
							} else if (fieldSchema instanceof ZodArray) {
								if (
									fieldSchema.description === "IngredientIdArray"
								) {
									return (
										<IngredientMultiSelect
											key={String(key)}
											name={key as Path<z.infer<T>>}
											form={form}
											getOptions={async () => {
												const ingredients =
													await getIngredients();
												return ingredients.map((i) => ({
													label: i.name,
													value: i._id,
												}));
											}}
										/>
									);
								}
							}
						})}

						<Button type="submit" className="w-full cursor-pointer">
							Submit
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
