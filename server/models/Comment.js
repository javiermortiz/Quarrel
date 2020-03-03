const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "user"
	},
	question: {
		type: Schema.Types.ObjectId,
		ref: "question"
	},
	comment: {
		type: String,
		required: true
	},
});

module.exports = mongoose.model("answer", CommentSchema);