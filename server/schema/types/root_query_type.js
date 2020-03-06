const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull, GraphQLString } = graphql;
const AuthService = require("../../services/auth");
const UserType = require("./user_type");
const QuestionType = require("./question_type");
const AnswerType = require("./answer_type");
const TopicType = require("./topic_type");
const CommentType = require("./comment_type");

const Topic = mongoose.model("topic");
const User = mongoose.model("user");
const Question = mongoose.model("question");
const Answer = mongoose.model("answer");
const Comment = mongoose.model("comment");

const RootQueryType = new GraphQLObjectType({
    name: "RootQueryType",
    fields: () => ({
        users: {
            type: new GraphQLList(UserType),
            resolve(_, args) {
                return User.find({});
            }
        },
        user: {
            type: UserType,
            args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(_, args) {
                return User.findById(args._id);
            }
        },
        currentUser: {
            type: UserType,
            args: {
                token: { type: GraphQLString }
            },
            resolve(_, args) {
                return AuthService.currentUser(args);
            }
        },
        questions: {
            type: new GraphQLList(QuestionType),
            resolve() {
                return Question.find({});
            }
        },
        question: {
            type: QuestionType,
            args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(_, args) {
                return Question.findById(args._id);
            }
        },
        similarQuestions: {
            type: new GraphQLList(QuestionType),
            args: { question: { type: GraphQLString } },
            resolve(_, args) {
                return Question.findMatches(args.question);
            }
        },
        relatedQuestions: {
            type: new GraphQLList(QuestionType),
            args: { questionId: { type: GraphQLID }},
            resolve(_, args) {
                return Question.findRelatedQuestions(args.questionId);
            }
        },
        answers: {
            type: new GraphQLList(AnswerType),
            resolve() {
                return Answer.find({});
            }
        },
        answer: {
            type: AnswerType,
            args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(_, args) {
                return Answer.findById(args._id);
            }
        },
        topics: {
            type: new GraphQLList(TopicType),
            resolve() {
                return Topic.find({});
            }
        },
        topic: {
            type: TopicType,
            args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parentValue, { _id }) {
                return Topic.findById(_id);
            }
				},
			comments: {
				type: new GraphQLList(CommentType),
				resolve()
				{
					return Comment.find({});
				}
			},
			comment: {
				type: CommentType,
				args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
				// resolve(parentValue, { _id }) {
				// 	return Comment.findById(_id);
				// }
				resolve(_, args) {
					return Comment.findById(args._id);
				}
      },
        topic_by_name: {
            type: TopicType,
            args: { name: { type: new GraphQLNonNull(GraphQLString) } },
            resolve(parentValue, { name }) {
                return Topic.findOne({ name });
            }
        },
        searchTopics: {
            type: new GraphQLList(TopicType),
            args: { query: { type: GraphQLString } },
            resolve(_, args) {
                return Topic.findMatches(args.query);
            }
        }
    })
});

module.exports = RootQueryType;