import React from "react";
import { Route, Switch } from "react-router-dom";
import NavBar from "./navigation/NavBar";
import Feed from "./main/feed";
import TopicShow from "./topics/TopicShow"
import SideBar from "./navigation/SideBar"
import QuestionShow from "./questions/QuestionShow";
import CommentItem from "./comment/CommentItem";
import SearchResults from "./search/SearchResults";

const Main = () => {
    return (
        <div className="main">
            <NavBar />
            {/* <SessionForm /> */}
            <div className="main-body">
                <Route exact path="/" component={SideBar} />
                <Switch>
                    <Route exact path="/" component={Feed} />
                    <Route exact path="/topics" component={TopicShow} />
										<Route path="/a" component={CommentItem} />
                    <Route exact path="/search/:query" component={SearchResults} />
                </Switch>
            </div>
        </div>
    )
};

export default Main;