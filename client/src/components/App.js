import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./session/Login";
import AuthRoute from "../util/route_util";
import Main from "./Main";
import SessionForm from "./session/SessionForm";
import TopicShow from "./topics/TopicShow"
import Show from "./Show";
import CommentItem from "./comment/CommentItem";

const App = () => {
	return (
		<div>
			<Switch>
				<Route exact path="/login" component={Login} />
				<Route exact path="/signup" component={SessionForm} />
				<Route path="/q/:id" component={Show} />
				<Route path="/c/:id" component={CommentItem} />
				<AuthRoute exact path="/session" component={SessionForm} routeType="auth"/>
				<AuthRoute path="/" component={Main} />
			</Switch>
		</div>
	);
};

export default App;