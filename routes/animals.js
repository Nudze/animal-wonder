const express = require("express");
const router = express.Router();

const Animal = require("../models/animal");

const { isLoggedIn, animalAuthorization } = require("../middleware/index");

// INDEX - show all animals
router.get("/", async (req, res) => {
	try {
		const animals = await Animal.find({});
		res.render("animals/index", { animals, page: "animals" });
	} catch (err) {
		console.log("error: ", err);
	}

	// Animal.find({}, (err, animals) => {
	// 	if (err) {
	// 		console.log("error: ", err);
	// 	} else {
	// 		res.render("animals/index", { animals });
	// 	}
	// });
});

// CREATE - add a new animal
router.post("/", isLoggedIn, async (req, res) => {
	try {
		const animal = await Animal.create(req.body.animal);
		animal.author = {
			id       : req.user._id,
			username : req.user.username
		};

		animal.save();
		res.redirect(`/animals/${animal._id}`);
	} catch (err) {
		console.log("error: ", err);
	}

	// const { name, image, description } = req.body.animal;

	// Animal.create({ name, image, description }, (err, animal) => {
	// 	if (err) {
	// 		console.log("error: ", err);
	// 	} else {
	// 		res.redirect("/animals");
	// 		console.log("added a new animal");
	// 	}
	// });
});

// NEW - show form for creating a new animal
router.get("/new", isLoggedIn, (req, res) => {
	res.render("animals/new");
});

// SHOW - show more information about an animal
router.get("/:id", async (req, res) => {
	try {
		const animal = await Animal.findById(req.params.id).populate("comments").exec();
		if (!animal) {
			res.redirect("back");
			console.log("no animal found");
		} else {
			res.render("animals/show", { animal });
		}
	} catch (err) {
		res.redirect("/");
		console.log("errorrrrrrrrrrr", err);
	}

	// Animal.findById(req.params.id, (err, animal) => {
	// 	if (err || !animal) {
	// 		res.redirect("back");
	// 		console.log("errorrrrrrrrrrr", err);
	// 	} else {
	// 		res.render("animals/show", { animal });
	// 	}
	// });
});

// EDIT
router.get("/:id/edit", animalAuthorization, (req, res) => {
	Animal.findById(req.params.id, (err, animal) => {
		if (err) {
			res.redirect("/animals");
		} else {
			res.render("animals/edit", { animal });
		}
	});
});

// UPDATE
router.put("/:id", animalAuthorization, (req, res) => {
	console.log(req.body.animal);
	Animal.findByIdAndUpdate(req.params.id, req.body.animal, (err, animal) => {
		if (err) {
			res.redirect("/animals");
		} else {
			// console.log(animal);
			res.redirect(`/animals/${req.params.id}`);
		}
	});
});

// DESTROY
router.delete("/:id", animalAuthorization, async (req, res) => {
	try {
		let foundAnimal = await Animal.findById(req.params.id);
		await foundAnimal.remove();
		res.redirect("/animals");
	} catch (error) {
		res.redirect("/animals");
	}
});

module.exports = router;
