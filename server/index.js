require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mealRouter = require("./routes/meal.router");
const app = express();

const PORT = process.env.API_PORT || 8888;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/meals", mealRouter);

app.listen(PORT, () => {
	console.log(`Now listening on port ${PORT}`);
});
