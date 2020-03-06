const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const Question = mongoose.model("question");
const AnswerType = require("./answer_type");

const QuestionType = new GraphQLObjectType({
    name: "QuestionType",
    fields: () => ({
        _id: { type: GraphQLID },
        question: { type: GraphQLString },
        user: {
            type: require("./user_type"),
            resolve(parentValue) {
                return Question.findById(parentValue._id)
                    .populate("user")
                    .then(question => {
                        return question.user;
                    });
            }
        },
        link: { type: GraphQLString },
        answers: {
            type: new GraphQLList(AnswerType),
            resolve(parentValue) {
                return Question.findById(parentValue._id)
                    .populate("answers")
                    .then(question => question.answers);
            }
				},
				comment: {
					type: new GraphQLList(AnswerType),
					resolve(parentValue)
					{
						return Answer.findById(parentValue._id)
							.populate("comments")
							.then(answer => answer.comments)
					}
				}
    })
});

module.exports = QuestionType;