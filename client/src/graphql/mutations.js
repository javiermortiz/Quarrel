import gql from "graphql-tag";

export default {
    REGISTER_USER: gql`
        mutation RegisterUser($fname: String!, $lname: String! $email: String!, $password: String!) {
            register(fname: $fname, lname: $lname, email: $email, password: $password) {
								email
								token
								loggedIn
								errors
								fname
								lname
								_id
            }
        }
    `,
    LOGIN_USER: gql`
        mutation LoginUser($email: String!, $password: String!) {
            login(email: $email, password: $password) {
						email
            token
						loggedIn
						errors
						_id
            }
        }
    `,
    VERIFY_USER: gql`
        mutation VerifyUser($token: String!) {
            verifyUser(token: $token) {
						loggedIn
						_id
						email
            }
        }
    `,
    NEW_QUESTION: gql`
        mutation NewQuestion($question: String, $link: String) {
            newQuestion(question: $question, link: $link) {
                _id
                date
                question
                link
                user {
                    _id
                }
            }
        }
		`,
		NEW_COMMENT: gql`
				mutation NewComment($comment: String, $answerId: ID!) {
					newComment(comment: $comment, answerId: $answerId) {
						_id
						comment
						user {
							_id
						}
						answer {
							_id
						}
					}
				}
    `,

    NEW_ANSWER: gql`
        mutation NewAnswer($body: String!, $questionId: ID!) {
            newAnswer(body: $body, questionId: $questionId) {
                _id
                body
                date
                user {
                    _id
                }
                question {
                    _id
                }
                upvotes {
                    user {
                        _id
                    }
                }
            }
        }
    `,
    FOLLOW_TOPIC: gql`
        mutation FollowTopic($topicId: ID!) {
            addTopicToUser(topicId: $topicId) {
                _id
                name
                followers {
                    _id
                }
            }
        }
    `,
    UPDATE_PROFILE_PIC: gql`
        mutation UpdateProfilePic($profileUrl: String!) {
            updateProfileUrl(profileUrl: $profileUrl) {
                _id
                fname
                profileUrl
            }
        }
    `,
    UPVOTE_ANSWER: gql`
        mutation UpvoteAnswer($answerId: ID) {
            upvoteAnswer(answerId: $answerId) {
                _id
                body
                user {
                    _id
                    fname
                    lname
                    profileUrl
                }
                upvotes {
                    user {
                        _id
                    }
                }
            }
        }
    `,
    DELETE_UPVOTE: gql`
        mutation DeleteUpvote($answerId: ID) {
            deleteUpvote(answerId: $answerId) {
                _id
                body
                user {
                    _id
                    fname
                    lname
                    profileUrl
                }
                upvotes {
                    user {
                        _id
                    }
                }
            }
        }
    `
}