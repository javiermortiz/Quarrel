import React from "react";
import TopicHeader from "./TopicHeader"
import QuestionShow from "../questions/QuestionShow"

import { Query } from "react-apollo";
import Queries from "../../graphql/queries";
const { FETCH_TOPICS } = Queries;

class TopicShow extends React.Component {
  render() {
    return (
      < div >
        <Query
          query={FETCH_TOPICS}
        >
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;
            return (
              data.topics.map(topic => {
                return <TopicHeader key={topic._id} topic={topic} currentUserId={CacheStorage.sessionId} />
              })
            )
          }}

        </Query>

        {/* <Query
          query={FETCH_ANSWERS_BY_TOPIC}
          variables={{ topicId=data.topic_by_name._id }}
        >
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;
            return null
            // return <QuestionShow key={data.topic_by_name._id} topic={data.topic_by_name} name={data.topic_by_name.name} />
          }}
        </Query> */}

      </div >
    );
  }
}

export default TopicShow;