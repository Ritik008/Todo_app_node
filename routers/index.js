const express = require("express");
const Task = require("../models/task");
const router = express.Router();
require("../db/connection");

router.get("/", (req, res) => {
	Task.find({}, (err, task) => {
		res.render("addTask", {
			tasks: task
		});
	});
});

router.post("/addTask", (req, res) => {
	let newTask = new Task({
		task: req.body.task
	});

	try {
		newTask.save((err, newTask) => {
			if (err) {
				console.log(err);
			} else {
				res.redirect("/");
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
				res.redirect("/");
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
	res.redirect("/");
});

module.exports = router;
