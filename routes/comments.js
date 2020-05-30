const express = require("express");
const router = express.Router({ mergeParams: true });

const Animal = require("../models/animal"),
	Comment = require("../models/comment");

const { isLoggedIn, commentAuthorization } = require("../middleware");

router.get("/new", isLoggedIn, async (req, res) => {
	try {
		const animal = await Animal.findById(req.params.id);
		if (!animal) {
			res.redirect("/animals");
		} else {
			res.render("comments/new", { animal });
		}
	} catch (err) {
		console.log(err);
		res.redirect("/animals");
	}

	// Animal.findById(req.params.id, (err, animal) => {
	// 	if (err || !animal) {
	// 		console.log(err);
	// 		res.redirect("/animals");
	// 	} else {
	// 		res.render("comments/new", { animal });
	// 	}
	// });
});

router.post("/", isLoggedIn, async (req, res) => {
	try {
		const animal = await Animal.findById(req.params.id);
		if (!animal) {
			res.redirect("/animals");
		} else {
			const comment = await Comment.create(req.body.comment);

			comment.author.id = req.user._id;
			comment.author.username = req.user.username;
			comment.save();

			animal.comments.push(comment);
			animal.save();
			console.log(animal);
			res.redirect(`/animals/${animal._id}`);
		}
	} catch (err) {
		console.log(err);
	}

	// 	Animal.findById(req.params.id, (err, animal) => {
	// 		if (err || !animal) {
	// 			console.log("first if", err);
	// 			res.redirect("/animals");
	// 		} else {
	// 			Comment.create(req.body.comment, (err, comment) => {
	// 				if (err) {
	// 					console.log("second if", err);
	// 				} else {
	// 					animal.comments.push(comment);
	// 					animal.save();

	// 					console.log(animal);
	// 					res.redirect(`/animals/${animal._id}`);
	// 				}
	// 			});
	// 		}
	// 	});
});

router.get("/:commentID/edit", commentAuthorization, (req, res) => {
	Comment.findById(req.params.commentID, (err, comment) => {
		if (err) {
			res.redirect("back");
		} else {
			res.render("comments/edit", { comment, animalID: req.params.id });
		}
	});
});

router.put("/:commentID", commentAuthorization, (req, res) => {
	Comment.findByIdAndUpdate(req.params.commentID, req.body.comment, (err, comment) => {
		if (err) {
			res.redirect("back");
		} else {
			res.redirect(`/animals/${req.params.id}`);
		}
	});
});

router.delete("/:commentID", commentAuthorization, (req, res) => {
	//should use findByIdAndDelete
	Comment.findByIdAndRemove(req.params.commentID, (err) => {
		if (err) {
			res.redirect("back");
		} else {
			res.redirect(`/animals/${req.params.id}`);
		}
	});
});

module.exports = router;
