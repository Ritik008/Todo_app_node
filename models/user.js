const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		unique: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("Email is invalid");
			}
		}
	},
	password: {
		type: String,
		required: true,
		trim: true,
		validate(value) {
			if (value.toLowerCase().includes("password")) {
				throw new Error("Password cannot contain password");
			}
			if (value.length < 6) {
				throw new Error("Too short password");
			}
		}
	},
	phoneNo: {
		type: String,
		trim: true
	}
});

userSchema.virtual("tasks", {
	ref: "tasks",
	localField: "_id",
	foreignField: "owner"
});

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error("Unable to login");
	}

	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		throw new Error("Unable to login");
	}
	return user;
};

// hash the plain text password before saving
userSchema.pre("save", async function(next) {
	const user = this;

	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}
});

const User = mongoose.model("users", userSchema);

module.exports = User;
