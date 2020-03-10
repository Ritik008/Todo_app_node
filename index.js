require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const routers = require("./routers/index");
var methodOverride = require("method-override");
require("./db/connection");

const app = express();

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));

// view engines
const viewsPath = path.join("./views");
app.set("view engine", "ejs");
app.set("views", viewsPath);

// Routers
app.use(routers);

// port number
const port = process.env.PORT;
app.listen(port, () => console.log(`Server is running at port ${port}`));
