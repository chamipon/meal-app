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
import {
	z,
	ZodObject,
	ZodString,
	ZodNumber,
	ZodReadonly,
	ZodArray,
	ZodDefault,
	ZodEnum,
} from "zod";
import type { ZodRawShape } from "zod";
import type { ReactNode } from "react";
import type { Path, DefaultValues } from "react-hook-form";
import { IngredientMultiSelect } from "./IngredientMultiSelect";
import { getIngredients } from "@/utils/api/ingredients";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectItem,
	SelectContent,
} from "../ui/select";
import { Separator } from "../ui/separator";
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
	const renderFormField = ({
		key,
		fieldSchema,
		parentStack = "",
	}: {
		key: any;
		fieldSchema: any;
		parentStack?: string;
	}) => {
		if (
			fieldSchema instanceof ZodString ||
			fieldSchema instanceof ZodNumber ||
			fieldSchema instanceof ZodDefault ||
			fieldSchema instanceof ZodReadonly
		) {
			return (
				<FormField
					key={String(key)}
					control={form.control}
					name={
						`${parentStack ? `${parentStack}.` : ""}${key}` as Path<
							z.infer<T>
						>
					}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="capitalize">
								{String(key)}
							</FormLabel>
							<FormControl>
								<Input
									disabled={
										fieldSchema instanceof ZodReadonly
									}
									type={
										fieldSchema instanceof ZodNumber
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
			if (fieldSchema.description === "IngredientIdArray") {
				return (
					<IngredientMultiSelect
						key={String(key)}
						name={key as Path<z.infer<T>>}
						form={form}
						getOptions={async () => {
							const ingredients = await getIngredients();
							return ingredients.map((i) => ({
								label: i.name,
								value: i._id,
							}));
						}}
					/>
				);
			}
		} else if (fieldSchema instanceof ZodObject) {
			return (
				<>
					<FormLabel className="capitalize text-md">
						{String(key)}
					</FormLabel>

					<div className="space-y-4">
						{Object.entries(fieldSchema.shape).map(
							([childKey, childSchema]) => {
								return renderFormField({
									key: childKey,
									fieldSchema: childSchema, // Pass the child schema to renderFormField
									parentStack: parentStack
										? `${parentStack}.${key}`
										: key,
								});
							}
						)}
					</div>
					<Separator />
				</>
			);
		} else if (fieldSchema instanceof ZodEnum) {
			return (
				<FormField
					key={String(key)}
					control={form.control}
					name={
						`${parentStack ? `${parentStack}.` : ""}${key}` as Path<
							z.infer<T>
						>
					}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="capitalize">
								{String(key)}
							</FormLabel>
							<FormControl>
								<Select
									onValueChange={field.onChange}
									{...field}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select unit" />
									</SelectTrigger>
									<SelectContent>
										{Object.keys(fieldSchema.Values).map(
											(key) => (
												<SelectItem
													key={key}
													value={key}
												>
													{key}
												</SelectItem>
											)
										)}
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			);
		}

		return null;
	};

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
						onSubmit={form.handleSubmit(
							(data) => {
								onSubmit(data);
							},
							(errors, e) => {
								console.log(errors);
								console.log(e?.target);
							}
						)}
						className="space-y-4 mt-4"
					>
						{(
							Object.entries(shape) as [
								keyof z.infer<T>,
								z.ZodTypeAny
							][]
						).map(([key, fieldSchema]) => {
							return renderFormField({ key, fieldSchema });
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
