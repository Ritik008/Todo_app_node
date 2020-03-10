const mongoose = require("mongoose");

const TodoSchema = mongoose.Schema({
	task: {
		type: String
	}
});

const task = mongoose.model("tasks", TodoSchema);

module.exports = task;
