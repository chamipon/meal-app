// IngredientMultiSelect.tsx
import { MultiSelect } from "@/components/ui/multi-select";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import type { UseFormReturn, Path } from "react-hook-form";
import type { z } from "zod";

type IngredientMultiSelectProps<T extends z.ZodTypeAny> = {
	name: Path<z.infer<T>>;
	form: UseFormReturn<z.infer<T>>;
	getOptions: () => Promise<{ label: string; value: string }[]>;
};

export function IngredientMultiSelect<T extends z.ZodTypeAny>({
	name,
	form,
	getOptions,
}: IngredientMultiSelectProps<T>) {
	const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

	useEffect(() => {
		getOptions().then(setOptions);
	}, [getOptions]);

	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel className="capitalize">{name}</FormLabel>
					<FormControl>
						<MultiSelect
							onValueChange={field.onChange}
							options={options}
							value={field.value}
							defaultValue={field.value}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
