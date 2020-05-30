const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	author  : {
		id       : {
			type : mongoose.Schema.Types.ObjectId,
			ref  : "User"
		},
		username : String
	},
	content : String
});

module.exports = mongoose.model("Comment", commentSchema);
