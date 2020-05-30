const Animal = require("../models/animal"),
	Comment = require("../models/comment");

const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
};

middlewareObj.commentAuthorization = (req, res, next) => {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.commentID, (err, comment) => {
			if (err) {
				req.flash("error", "Comment not found!");
				res.redirect("back");
			} else {
				if (comment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("/login");
	}
};

middlewareObj.animalAuthorization = (req, res, next) => {
	if (req.isAuthenticated()) {
		Animal.findById(req.params.id, (err, animal) => {
			if (err) {
				req.flash("error", "Animal not found!");
				res.redirect("back");
			} else {
				if (animal.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("/login");
	}
};

module.exports = middlewareObj;
