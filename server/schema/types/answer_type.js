const graphql = require("graphql");
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } = graphql;

const mongoose = require("mongoose");
const Answer = mongoose.model("answer");
const CommentType = require("./comment_type");
const UpvoteType = require("./upvote_type");


const AnswerType = new GraphQLObjectType({
  name: "AnswerType",
  fields: () => ({
    _id: { type: GraphQLID },
    body: { type: GraphQLString },
    user: {
            type: require("./user_type"),
            resolve(parentValue) {
                return Answer.findById(parentValue._id)
                    .populate("user")
                    .then(answer => {
                        return answer.user
                    });
            }
        },
    question: {
      type: require("./question_type"),
      resolve(parentValue) {
        return Answer.findById(parentValue._id)
          .populate("question")
          .then(answer=> {
            return answer.question
          });
      }
		},
		comments: {
			type: new GraphQLList(CommentType),
			resolve(parentValue) {
				return Answer.findById(parentValue._id)
					.populate("comments")
					.then(answer => answer.comments);
			}
    },
    upvotes: {
      type: new GraphQLList(UpvoteType),
      resolve(parentValue) {
        return Answer.findById(parentValue.id)
          .populate("upvotes")
          .then(answer => answer.upvotes);
      }
    }
  })
});

module.exports = AnswerType;
