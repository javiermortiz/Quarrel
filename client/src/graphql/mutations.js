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
                question
                link
                user {
                    name
                }
            }
        }
		`,
		NEW_COMMENT: gql`
				mutation NewComment($comment: String) {
					newComment(comment:$comment) {
						_id
						comment
						user {
							name
						}
					}
				}
		`
}