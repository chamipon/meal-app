import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import Container from "@mui/material/Container";
function App() {
	const [meals, setMeals] = useState([]);
	const [title, setTitle] = useState();
	useEffect(() => {
		getMeals();
	}, []);
	async function getMeals() {
		let res = await fetch("http://localhost:8888/meals");
		let data = await res.json();
		setMeals(data);
	}
	async function deleteMeals() {
		let res = await fetch("http://localhost:8888/meals", {
			method: "DELETE",
		});
		let data = await res.json();
		console.log(data);
		setMeals(data);
	}
	async function deleteMeal(id) {
		if (id != null) {
			let res = await fetch("http://localhost:8888/meals/" + id, {
				method: "delete",
			});
		}
		setMeals(meals.filter((meal) => meal.id !== id));
	}
	async function addMeal() {
		if (title != null) {
			let body = {
				title: title,
			};
			let res = await fetch("http://localhost:8888/meals", {
				method: "POST",
				mode: "cors",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			let data = await res.json();

			setMeals(meals.concat(data));
			setTitle("");
		}
	}
	function handleTextareaChange(e) {
		setTitle(e.target.value);
	}
	return (
		<div className="App">
			<h1>Meal App</h1>
			<Container sx={{ flexGrow: 1 }}>
				<Grid container spacing={2}>
					<Grid container>
						{meals.map((item) => (
							<Grid data-id={item.id} key={item.id} size={4}>
								<Card sx={{ minWidth: 275 }}>
									<CardContent>
										<Typography variant="h5" component="div">
											{item.title}
										</Typography>
									</CardContent>
									<CardActions>
										<Button
											key={"delete" + item.id}
											onClick={() => {
												deleteMeal(item.id);
											}}
											variant="outlined"
											color="error"
										>
											<DeleteIcon />
											Delete
										</Button>
										<Button
											key={"edit" + item.id}
											variant="outlined"
											color="secondary"
											spacing={2}
										>
											<EditIcon />
											Edit
										</Button>
									</CardActions>
								</Card>
							</Grid>
						))}
					</Grid>
				</Grid>
				<Grid container size={8}>
					<Stack direction="column" container size={12}>
						<TextField
							id="standard-basic"
							label="Meal Title"
							variant="outlined"
							value={title}
							onChange={handleTextareaChange}
						/>
						<Button
							onClick={addMeal}
							variant="contained"
							color="success"
							size="large"
						>
							<AddIcon />
							Add Meal
						</Button>
						<Button
							onClick={deleteMeals}
							variant="contained"
							color="error"
							size="large"
						>
							<DeleteForeverIcon />
							Delete All Meals
						</Button>
					</Stack>
				</Grid>
			</Container>
		</div>
	);
}

export default App;
