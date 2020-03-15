require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const flash = require("express-flash");
const session = require("express-session");
const taskRouter = require("./routers/task");
const userRouter = require("./routers/user");
const methodOverride = require("method-override");
require("./db/connection");
const jwt = require("jsonwebtoken");
const localstorage = require("local-storage");

const app = express();

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));

// initialize session middleware -flash-express depend on it
app.use(
	session({
		secret: "thesecretkey",
		resave: false,
		saveUninitialized: true
	})
);

// initialize flash middleware
app.use(flash());

// view engines
const viewPath = path.join("./views");
app.set("view engine", "ejs");
app.set("views", viewPath);

// Routers
app.use(userRouter);
app.use(taskRouter);

const Task = require("./models/task");
const User = require("./models/user");
const main = async () => {
	// const task = await Task.findById("5e6e56e26023e04764e55cf0");
	// await task.populate("owner").execPopulate();
	// console.log(task.owner);

	const user = await User.findById("5e6c690fa32ce31cd4be868b");
	await user.populate("tasks").execPopulate();
	console.log(user.tasks);
};

main();

// port number
const port = process.env.PORT;
app.listen(port, () => console.log(`Server is running at port ${port}`));
