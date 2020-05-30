const express = require("express");
const router = express.Router();

const passport = require("passport");

router.get("/", (req, res) => {
	res.render("home");
});

router.get("/register", (req, res) => {
	res.render("register", { page: "register" });
});

router.post("/register", (req, res) => {
	const { username, password } = req.body;

	console.log("USERNAME: ", username);
	console.log("PASSWORD: ", password);

	User.register(new User({ username }), password, (err, user) => {
		if (err) {
			console.log(err);
			return res.redirect("/register");
		}
		console.log(user);
		passport.authenticate("local")(req, res, () => {
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
	res.redirect("/animals");
});

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;
