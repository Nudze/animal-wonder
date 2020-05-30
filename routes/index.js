const express = require("express");
const router = express.Router();

const passport = require("passport");

const User = require("../models/user");

router.get("/", (req, res) => {
	res.render("home");
});

router.get("/register", (req, res) => {
	res.render("register", { page: "register" });
});

router.post("/register", (req, res) => {
	const { username, password } = req.body;
	User.register(new User({ username }), password, (err, user) => {
		if (err) {
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		console.log(user);
		passport.authenticate("local")(req, res, () => {
			req.flash("success", `Welcome to AminalWonder ${user.username}`);
			res.redirect("/animals");
		});
	});
});

router.get("/login", (req, res) => {
	res.render("login", { page: "login" });
});

router.post(
	"/login",
	passport.authenticate("local", {
		successRedirect : "/animals",
		failureRedirect : "/login"
	}),
	(req, res) => {}
);

router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "You are logged out now.");
	res.redirect("/animals");
});

module.exports = router;
