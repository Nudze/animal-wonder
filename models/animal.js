const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema({
	name            : String,
	scientific_name : String,
	diet            : String,
	life_span       : String,
	size            : String,
	image           : String,
	description     : String,
	images          : [ { type: String } ],
	author          : {
		id       : {
			type : mongoose.Schema.Types.ObjectId,
			ref  : "User"
		},
		username : String
	},
	comments        : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref  : "Comment"
		}
	]
});

// PRE HOOK THE MODEL, SO IF WE DELETE CAMPGROUNDS, WE DELETE ALL COMMENTS ON THAT CAMPGROUND
const Comment = require("./comment");
animalSchema.pre("remove", async function () {
	await Comment.deleteMany({
		_id : {
			$in : this.comments
		}
	});
});

module.exports = mongoose.model("Animal", animalSchema);
