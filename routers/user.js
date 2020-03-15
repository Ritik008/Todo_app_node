const express = require("express");
const User = require("../models/user");
const task = require("../routers/task");
const auth = require("../auth/auth");
require("../db/connection");
const router = express.Router();

router.get("/", (req, res) => {
	res.render("dashboard");
});

router.get("/login", (req, res) => {
	res.render("login", { name: req.name });
});

router.post("/login", (req, res) => {
	try {
		User.findByCredentials(req.body.email, req.body.password)
			.then((user) => {
				auth.generateAuthToken(user._id);
				res.redirect(
					task.route(`/addTask/${user._id}?name=${user.firstName}`).path
				);
			})
			.catch((err) => {
				console.log(err);
			});
	} catch (e) {
		console.log(e);
	}
});

router.get("/register", (req, res) => {
	res.render("register");
});

router.post("/register", (req, res) => {
	const user = new User(req.body);
	user
		.save()
		.then((user) => {
			res.render("login");
		})
		.catch((e) => {
			req.flash("Error", "Please fill up your details");
			res.redirect("/register");
		});
});

module.exports = router;
