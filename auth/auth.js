require("dotenv").config();
const jwt = require("jsonwebtoken");
const localstorage = require("local-storage");

const generateAuthToken = async (id) => {
	try {
		const token = jwt.sign({ id, iat: 3600 }, process.env.SECRET_KEY);
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
			jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
				if (err) {
					return res.send("<h1>Please login</h1>");
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
