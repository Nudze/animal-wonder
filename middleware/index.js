const Animal = require("../models/animal"),
	Comment = require("../models/comment");

const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
};

middlewareObj.commentAuthorization = (req, res, next) => {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.commentID, (err, comment) => {
			if (err) {
				res.redirect("back");
			} else {
				if (comment.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("/login");
	}
};

middlewareObj.animalAuthorization = (req, res, next) => {
	if (req.isAuthenticated()) {
		Animal.findById(req.params.id, (err, animal) => {
			if (err) {
				res.redirect("back");
			} else {
				if (animal.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("/login");
	}
};

module.exports = middlewareObj;
