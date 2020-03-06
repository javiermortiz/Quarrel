import React from "react";
import { Link } from "react-router-dom";
import { ApolloConsumer, Query } from "react-apollo";
import { withRouter } from "react-router";

import * as SessionUtil from "../../util/session_util";
import Queries from "../../graphql/queries";
const { IS_LOGGED_IN } = Queries;

const SessionButton = props =>
{

	const logout = client => e =>
	{
		e.preventDefault();
		SessionUtil.logoutUser(client);
		// props.history.push("/");
	};

	const renderSessionButton = (client, isLoggedIn) =>
	{
		return isLoggedIn ? (
				<button className="nav-ask-btn" onClick={logout(client)}>Logout</button>
		) : (
				<button className="nav-ask-btn">
					<Link to="/session" className="">Signin</Link>
				</button>
			);
	}

	return (
		<ApolloConsumer>
			{client => (
				<Query query={IS_LOGGED_IN}>
					{({ data: { isLoggedIn } }) => renderSessionButton(client, isLoggedIn)}
				</Query>
			)}
		</ApolloConsumer>
	);
};

export default withRouter(SessionButton);