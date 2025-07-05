import React from "react";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form"; // ShadCN form components
import { Input } from "@/components/ui/input"; // ShadCN Input
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectItem,
	SelectContent,
} from "@/components/ui/select"; // ShadCN Select components

import { UnitEnum } from "@/types/Amount"; // Assuming your Zod enum is defined elsewhere
// Define the form data type from the schema

// Props for the reusable component
interface QuantityUnitInputProps {
	name: string;
	label: string;
	control: any; // react-hook-form control
}

const QuantityUnitInput: React.FC<QuantityUnitInputProps> = ({
	name,
	label,
	control,
}) => {
	return (
		<div>
			{/* Quantity Field */}
			<FormLabel className="capitalize">{label}</FormLabel>
			<div className="flex gap-2 items-center">
				<FormField
					control={control}
					name={`${name}.quantity`}
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel
								htmlFor={`${name}.quantity`}
								className="text-sm font-medium text-muted-foreground sr-only"
							>
								Quantity
							</FormLabel>
							<FormControl> 
								<Input
									{...field}
									id={`${name}.quantity`}
									type="number"
									placeholder="Enter quantity"
									className="mt-2 w-full"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Unit Field */}
				<FormField
					control={control}
					name={`${name}.unit`}
					render={({ field }) => (
						<FormItem>
							<FormLabel
								htmlFor={`${name}.unit`}
								className="text-sm font-medium text-muted-foreground sr-only"
							>
								Unit
							</FormLabel>
							<FormControl>
								<Select
									{...field}
									name={`${name}.unit`}
									onValueChange={field.onChange}
								>
									<SelectTrigger className="mt-2 w-full">
										<SelectValue placeholder="Select unit" />
									</SelectTrigger>
									<SelectContent>
										{Object.values(UnitEnum.options).map(
											(unit) => (
												<SelectItem
													key={unit}
													value={unit}
												>
													{unit}
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
			</div>
		</div>
	);
};

export default QuantityUnitInput;
