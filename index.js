require("dotenv").config({ path: ".env" });
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const flash = require("express-flash");
const taskRouter = require("./routers/task");
const userRouter = require("./routers/user");
const methodOverride = require("method-override");
const session = require("express-session");
require("./db/dbConnection");

const app = express();

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));

// initialize session middleware -flash-express depend on it
app.use(
	session({
		secret: process.env.SECRET_KEY,
		resave: true,
		saveUninitialized: true
	})
);

// initialize flash middleware
app.use(flash());

// view engines
const viewPath = path.join("./views");
app.set("view engine", "ejs");
app.set("views", viewPath);
app.use(express.static(path.join(__dirname, "/public")));

// Routers
app.use(userRouter);
app.use(taskRouter);

// port number
const port = process.env.PORT;
app.listen(port, () => console.log(`Server is running at port ${port}`));
