const jwt = require("jsonwebtoken");
const User = require("../models/user");
const localstorage = require("local-storage");

const generateAuthToken = async (id) => {
	try {
		const token = jwt.sign({ id }, "secretkey");
		localstorage.set("token", token);
	} catch (e) {
		console.log(e);
	}
};

const verifyToken = (req, res, next) => {
	const bearerHeader = localstorage.get("token");
	try {
		if (bearerHeader !== "undefined") {
			req.token = bearerHeader;
			jwt.verify(req.token, "secretkey", (err, authData) => {
				if (err) {
					return res.send("Please login");
				}
			});
			next();
		} else {
			// Forbidden
			res.sendStatus(403);
		}
	} catch (e) {
		console.log(e);
	}
};

module.exports = { generateAuthToken, verifyToken };
