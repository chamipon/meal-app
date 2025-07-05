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
import { useState, type ReactNode } from "react";
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
import { toast } from "sonner";
import { type AxiosResponse } from "axios";
interface ReusableFormDialogProps<T extends ZodObject<ZodRawShape>> {
	schema: T;
	trigger: ReactNode;
	title: string;
	description?: string;
	defaultValues?: z.infer<T>;
    successMessage? : string;
    errorMessage? : string;
	onSubmit: (data: z.infer<T>) => Promise<AxiosResponse>;
}

export const ReusableFormDialog = <T extends ZodObject<ZodRawShape>>({
	schema,
	trigger,
	title,
	description,
	defaultValues,
    successMessage,
    errorMessage,
	onSubmit,
}: ReusableFormDialogProps<T>) => {
	const form = useForm<z.infer<T>>({
		resolver: zodResolver(schema),
		defaultValues: defaultValues as DefaultValues<z.infer<T>>,
	});
	const [dialogOpen, setDialogOpen] = useState(false);
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
	const formSubmit = async (data: z.TypeOf<T>) => {   
		const response = await onSubmit(data);
		console.log(response);
        //On Success
		if ([200, 201, 202, 204].includes(response.status)) {
			toast.success(successMessage ?? "Operation Successful!");
			setDialogOpen(false);
		}
        else{
            toast.error(errorMessage ?? "Operation Failed!")
        }
        
	};
	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
							async (data) => {
								formSubmit(data);
							},
							(errors) => {
								console.log(errors);
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
