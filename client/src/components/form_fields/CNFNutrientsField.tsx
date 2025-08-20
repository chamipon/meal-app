import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "../ui/card";
import {
	ChevronDown,
	ChevronUp,
	Plus,
	X,
	Zap,
	Dumbbell,
	Droplets,
	Wheat,
} from "lucide-react";
import type { UseFormReturn, Path } from "react-hook-form";
import type { z } from "zod";
import type { CNFNutrient } from "../../types/CNFNutrient";
import {
	getMainNutrients,
	groupNutrientsByGroup,
	formatNutrientValue,
} from "../../utils/nutrition";

// Icons for different nutrient groups
const GROUP_ICONS: Record<
	number,
	React.ComponentType<{ className?: string }>
> = {
	1: Zap, // Proximate (energy, protein, fat, carbs)
	2: Droplets, // Inorganic
	3: Wheat, // Minerals
	4: Dumbbell, // Vitamins
	5: Dumbbell, // Amino Acids
	6: Droplets, // Fatty Acids
	7: Wheat, // Other
};

type CNFNutrientsFieldProps<T extends z.ZodTypeAny> = {
	name: Path<z.infer<T>>;
	form: UseFormReturn<z.infer<T>>;
	label?: string;
	showGrouped?: boolean;
	maxMainNutrients?: number;
	editable?: boolean;
	className?: string;
};

export function CNFNutrientsField<T extends z.ZodTypeAny>({
	name,
	form,
	label = "Nutrients",
	showGrouped = false,
	maxMainNutrients = 6,
	editable = false,
	className,
}: CNFNutrientsFieldProps<T>) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [expandedGroups, setExpandedGroups] = useState<Set<number>>(
		new Set()
	);

	const toggleGroup = (groupId: number) => {
		const newExpanded = new Set(expandedGroups);
		if (newExpanded.has(groupId)) {
			newExpanded.delete(groupId);
		} else {
			newExpanded.add(groupId);
		}
		setExpandedGroups(newExpanded);
	};

	const removeNutrient = (index: number, currentValue: CNFNutrient[]) => {
		const newNutrients = currentValue.filter((_, i) => i !== index);
		form.setValue(name, newNutrients as any);
	};

	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => {
				const nutrients = (field.value as CNFNutrient[]) || [];
				const mainNutrients = getMainNutrients(nutrients);
				const groupedNutrients = groupNutrientsByGroup(nutrients);

				if (nutrients.length === 0) {
					return (
						<FormItem className={className}>
							<FormLabel>{label}</FormLabel>
							<FormControl>
								<div className="border rounded-lg p-4 text-center text-muted-foreground text-sm">
									No nutritional data available
									{editable && (
										<Button
											variant="outline"
											size="sm"
											className="ml-2"
										>
											<Plus className="h-4 w-4 mr-1" />
											Add Nutrient
										</Button>
									)}
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					);
				}

				if (showGrouped) {
					return (
						<FormItem className={className}>
							<FormLabel className="flex items-center justify-between">
								{label}
								<Badge variant="secondary" className="text-xs">
									{nutrients.length} nutrients
								</Badge>
							</FormLabel>
							<FormControl>
								<div className="space-y-2 border rounded-lg p-3">
									{Object.entries(groupedNutrients).map(
										([groupId, group]) => {
											const IconComponent =
												GROUP_ICONS[Number(groupId)];

											return (
												<Collapsible key={groupId}>
													<CollapsibleTrigger asChild>
														<Button
															variant="ghost"
															className="w-full justify-between p-2"
															onClick={() =>
																toggleGroup(
																	Number(
																		groupId
																	)
																)
															}
														>
															<div className="flex items-center">
																{IconComponent && (
																	<IconComponent className="h-4 w-4 mr-2" />
																)}
																<span className="text-sm">
																	{group.name}
																</span>
																<Badge
																	variant="outline"
																	className="ml-2 text-xs"
																>
																	{
																		group
																			.nutrients
																			.length
																	}
																</Badge>
															</div>
															<ChevronDown className="h-4 w-4" />
														</Button>
													</CollapsibleTrigger>
													<CollapsibleContent className="space-y-1 pl-6 pt-2">
														{group.nutrients.map(
															(
																nutrient,
																index
															) => (
																<div
																	key={index}
																	className="flex justify-between items-center py-1"
																>
																	<span className="text-sm text-muted-foreground">
																		{nutrient.nutrient_web_name ||
																			nutrient
																				.nutrient_name
																				?.nutrient_web_name}
																	</span>
																	<div className="flex items-center gap-2">
																		<Badge
																			variant="outline"
																			className="font-mono text-xs"
																		>
																			{formatNutrientValue(
																				nutrient
																			)}
																		</Badge>
																		{editable && (
																			<Button
																				variant="ghost"
																				size="sm"
																				className="h-6 w-6 p-0"
																				onClick={() => {
																					const globalIndex =
																						nutrients.findIndex(
																							(
																								n
																							) =>
																								n.nutrient_name_id ===
																								nutrient.nutrient_name_id
																						);
																					if (
																						globalIndex !==
																						-1
																					) {
																						removeNutrient(
																							globalIndex,
																							nutrients
																						);
																					}
																				}}
																			>
																				<X className="h-3 w-3" />
																			</Button>
																		)}
																	</div>
																</div>
															)
														)}
													</CollapsibleContent>
												</Collapsible>
											);
										}
									)}
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					);
				}

				// Compact card view
				return (
					<FormItem className={className}>
						<FormLabel className="flex items-center justify-between">
							{label}
							<Badge variant="secondary" className="text-xs">
								{nutrients.length} total
							</Badge>
						</FormLabel>
						<FormControl>
							<Card className="w-full">
								<CardContent className="pt-4 space-y-3">
									{/* Main nutrients display */}
									<div className="grid grid-cols-2 gap-2">
										{mainNutrients
											.slice(0, maxMainNutrients)
											.map((nutrient, index) => (
												<div
													key={index}
													className="flex justify-between items-center p-2 bg-muted/50 rounded"
												>
													<span className="text-sm font-medium">
														{nutrient.name}
													</span>
													<Badge
														variant="outline"
														className="font-mono text-xs"
													>
														{nutrient.value.toFixed(
															1
														)}{" "}
														{nutrient.unit}
													</Badge>
												</div>
											))}
									</div>

									{/* Show remaining nutrients count and expand option */}
									{nutrients.length > maxMainNutrients && (
										<>
											<Separator />
											<Collapsible
												open={isExpanded}
												onOpenChange={setIsExpanded}
											>
												<CollapsibleTrigger asChild>
													<Button
														variant="ghost"
														className="w-full justify-between text-sm"
													>
														<span>
															{isExpanded
																? "Hide"
																: "Show"}{" "}
															all nutrients (
															{nutrients.length -
																maxMainNutrients}{" "}
															more)
														</span>
														{isExpanded ? (
															<ChevronUp className="h-4 w-4" />
														) : (
															<ChevronDown className="h-4 w-4" />
														)}
													</Button>
												</CollapsibleTrigger>
												<CollapsibleContent className="space-y-2">
													{nutrients
														.slice(maxMainNutrients)
														.map(
															(
																nutrient,
																index
															) => (
																<div
																	key={index}
																	className="flex justify-between items-center py-1 px-2"
																>
																	<span className="text-xs text-muted-foreground">
																		{nutrient.nutrient_web_name ||
																			nutrient
																				.nutrient_name
																				?.nutrient_web_name}
																	</span>
																	<div className="flex items-center gap-2">
																		<Badge
																			variant="outline"
																			className="font-mono text-xs"
																		>
																			{formatNutrientValue(
																				nutrient
																			)}
																		</Badge>
																		{editable && (
																			<Button
																				variant="ghost"
																				size="sm"
																				className="h-6 w-6 p-0"
																				onClick={() =>
																					removeNutrient(
																						maxMainNutrients +
																							index,
																						nutrients
																					)
																				}
																			>
																				<X className="h-3 w-3" />
																			</Button>
																		)}
																	</div>
																</div>
															)
														)}
												</CollapsibleContent>
											</Collapsible>
										</>
									)}
								</CardContent>
							</Card>
						</FormControl>
						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
}
