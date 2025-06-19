import { Calendar, Carrot, Ham, Home, Settings, Utensils } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	//SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTheme } from "@/contexts/theme-provider";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
// Menu items.
const sections = [
	{
		label: "Food",
		items: [
			{
				title: "Home",
				url: "",
				icon: Home,
			},
			{
				title: "Meals",
				url: "/meals",
				icon: Utensils,
			},
			{
				title: "Food",
				url: "/foods",
				icon: Ham,
			},
			{
				title: "Ingredients",
				url: "/ingredients",
				icon: Carrot,
			},
		],
	},
	{
		label: "Management",
		items: [
			{
				title: "Calendar",
				url: "/calendar",
				icon: Calendar,
			},
		],
	},
];

export function AppSidebar() {
	const { setTheme } = useTheme();
	const location = useLocation();
	return (
		<Sidebar>
			<SidebarContent>
				<SidebarMenu>
					{sections.map((section, index) => (
						<>
							<SidebarGroup key={index}>
								<SidebarGroupLabel>
									{section.label}
								</SidebarGroupLabel>
								{section.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											isActive={location.pathname === item.url}
											asChild
										>
											<Link to={item.url}>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarGroup>
						</>
					))}
					<SidebarGroup>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link to="#">
									<Settings />
									<span>Settings</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<SidebarMenuButton>
										<Sun className=" scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
										<Moon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
										<span>Toggle Theme</span>
									</SidebarMenuButton>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										onClick={() => setTheme("light")}
									>
										Light
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => setTheme("dark")}
									>
										Dark
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => setTheme("system")}
									>
										System
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					</SidebarGroup>
				</SidebarMenu>
			</SidebarContent>
		</Sidebar>
	);
}
