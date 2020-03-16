const express = require("express");
const Task = require("../models/task");
const auth = require("../auth/auth");
const localstorage = require("local-storage");
const router = express.Router();
require("../db/connection");

router.get("/addTask/:id", auth.verifyToken, (req, res) => {
	const _id = req.params.id;
	req.session.name = req.query.name;
	req.session._id = _id;
	Task.find({ owner: _id }, (err, task) => {
		res.render("addTask", {
			tasks: task,
			name: req.query.name,
			id: _id
		});
	});
});

router.post("/addTask/:id", auth.verifyToken, (req, res) => {
	let newTask = new Task({
		task: req.body.task,
		owner: req.params.id
	});

	try {
		newTask.save((err, newTask) => {
			if (err) {
				console.log(err);
			} else {
				res.redirect(`/addTask/${req.params.id}?name=${req.query.name}`);
			}
		});
	} catch (e) {
		console.log(e);
	}
});

router.get("/updateTask/:id", (req, res) => {
	Task.findById({ _id: req.params.id }, (err, task) => {
		if (err) {
			return console.log(err);
		} else {
			res.render("updateTask", { tasks: task });
		}
	});
});

router.patch("/updateTask/:id", (req, res) => {
	Task.findOneAndUpdate(
		{ _id: req.params.id },
		{ task: req.body.task },
		{ useFindAndModify: false },
		(err, task) => {
			if (err) {
				console.log(err);
			} else {
				res.redirect(`/addTask/${req.session._id}?name=${req.session.name}`);
			}
		}
	);
});

router.delete("/deleteTask/:id", (req, res) => {
	Task.deleteOne({ _id: req.params.id }, (err, task) => {
		if (err) {
			console.log(err);
		}
	});
	res.redirect(`/addTask/${req.session._id}?name=${req.session.name}`);
});

router.get("/logout", (req, res) => {
	if (req.session) {
		req.session.destroy((err) => {
			if (err) {
				return next(err);
			} else {
				localstorage.remove("token");
				res.redirect("/");
			}
		});
	}
});

module.exports = router;
