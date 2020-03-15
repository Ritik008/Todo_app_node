const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
	task: {
		type: String,
		required: true,
		unique: true
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "users"
	}
});

const task = mongoose.model("tasks", taskSchema);

module.exports = task;
