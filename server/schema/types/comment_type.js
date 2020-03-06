const graphql = require("graphql");
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } = graphql;

const mongoose = require("mongoose");
const Comment = mongoose.model("comment");

const CommentType = new GraphQLObjectType({
	name: "CommentType",
	fields: () => ({
		_id: { type: GraphQLID },
		comment: { type: GraphQLString },
		user: {
			type: require("./user_type"),
			resolve(parentValue) {
				return Comment.findById(parentValue._id)
					.populate("user")
					.then(comment => {
						return comment.user
					});
			}
		},
		// question: {
		// 	type: require("./question_type"),
		// 	resolve(parentValue)
		// 	{
		// 		return Comment.findById(parentValue._id)
		// 			.populate("question")
		// 			.then(comment =>
		// 			{
		// 				return comment.question
		// 			});
		// 	}
		// },
		answer: {
			type: require("./answer_type"),
			resolve(parentValue) {
					return Comment.findById(parentValue._id)
						.populate("answer")
						.then(comment => {
							return comment.answer
						});
			}
		}
	})
});

module.exports = CommentType;
