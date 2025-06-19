"use client";
import { Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { MealList } from "@/pages/MealList";
import { FoodList } from "./pages/FoodList";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { IngredientList } from "./pages/IngredientList";
import { ThemeProvider } from "./contexts/theme-provider";
export default function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<SidebarProvider>
				<AppSidebar />
				<main className="w-full mx-auto p-4 space-y-6">
					<SidebarTrigger />
					<h1 className="text-3xl font-bold">Meal App</h1>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/meals" element={<MealList />} />
						<Route path="/ingredients" element={<IngredientList />} />
						<Route path="/foods" element={<FoodList />} />
					</Routes>
				</main>
			</SidebarProvider>
		</ThemeProvider>
	);
}
