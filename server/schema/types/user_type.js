const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLBoolean, GraphQLList } = graphql;
const User = mongoose.model("user");

const UserType = new GraphQLObjectType({
    name: "UserType",
    fields: () => ({
        _id: { type: GraphQLID },
        fname: { type: GraphQLString },
        lname: { type: GraphQLString },
        email: { type: GraphQLString },
        profileUrl: { type: GraphQLString },
        token: { type: GraphQLString },
				loggedIn: { type: GraphQLBoolean },
				isLoggedIn: { type: GraphQLBoolean },
        errors: { type: new GraphQLList(GraphQLString) },
        followers: {
            type: new GraphQLList(require("./user_type")),
            resolve(parentValue) {
                return Topic.findData(parentValue.id, 'users');
            }
        }
    })

});

module.exports = UserType;