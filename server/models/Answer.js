const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "user"
	},
	question: {
		type: Schema.Types.ObjectId,
		ref: "question"
	},
	body: {
		type: String,
		required: true
	},
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: "comment"
		}
	],
	upvotes: [
		{
			type: Schema.Types.ObjectId,
			ref: "upvote"
		}
	],
	date: {
		type: Date,
		required: true
	}
});

// CommentSchema.statics.findComment = function (commentId, type)
// {
// 	return this.findById(commentId)
// 		.populate(`${type}`)
// 		.then(comment => comment[type])
// 		.catch(err => null)
// };

// CommentSchema.statics.addnewComment = (answerId, commentId) =>
// {
// 	const Answer = mongoose.model("answer");
// 	const Comment = mongoose.model("comment");

// 	return Answer.findById(anwerId).then(foundAnswer =>
// 	{
// 		return Comment.findById(commentId).then(foundComment =>
// 		{
// 			foundAnswer.comments.push(foundComment);
// 			foundComment.anwers.push(foundAnswer);
// 			return Promise.all([foundAnswer.save(), foundComment.save()]).then(
// 				([savedAnswer, savedComment]) => savedAnswer
// 			);
// 		});
// 	});
// };

module.exports = mongoose.model("answer", AnswerSchema);