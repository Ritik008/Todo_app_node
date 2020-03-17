const express = require("express");
const User = require("../models/user");
const task = require("../routers/task");
const auth = require("../auth/auth");
require("../db/connection");
const router = express.Router();

let sess;
router.get("/", (req, res) => {
	if (!req.session.email) {
		res.render("dashboard");
	} else {
		res.redirect(task.route(`/addTask/${sess._id}?name=${sess.name}`).path);
	}
});

router.get("/login", (req, res) => {
	if (!req.session.email) {
		res.render("login");
	} else {
		res.redirect(task.route(`/addTask/${sess._id}?name=${sess.name}`).path);
	}
});

router.post("/login", (req, res) => {
	User.findByCredentials(req.body.email, req.body.password)
		.then((user) => {
			sess = req.session;
			sess.email = req.body.email;
			sess._id = user._id;
			sess.name = user.firstName;
			auth.generateAuthToken(user._id);
			res.redirect(
				task.route(`/addTask/${user._id}?name=${user.firstName}`).path
			);
		})
		.catch((err) => {
			req.flash("Error", "Unable to login");
			res.redirect("/login");
		});
});

router.get("/register", (req, res) => {
	if (!req.session.email) {
		res.render("register");
	} else {
		res.redirect(task.route(`/addTask/${sess._id}?name=${sess.name}`).path);
	}
});

router.post("/register", (req, res) => {
	const user = new User(req.body);
	user
		.save()
		.then(() => {
			res.render("login");
		})
		.catch((e) => {
			req.flash("Error", "1. Please fill up your details");
			req.flash("Error", " 2. Check if you set password as 'password'");
			req.flash("Error", " 3. Please Check your Email");
			res.redirect("/register");
		});
});

module.exports = router;
