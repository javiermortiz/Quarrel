import React from "react";
import { Link } from "react-router-dom"

class TopicNavBar extends React.Component {

  render() {
    return (
      <div>
        <div className="TopicPageNavBar">
          <ul className="list_content">
            <Link to="/topic" className="linked_list_item">Read</Link>
            <Link to="/topics/top_questions" className="linked_list_item">Answer</Link>
            <Link to="/topics/writers" className="linked_list_item">Most Viewed Writers</Link>
          </ul>
        </div>
      </div>
    );
  }
}

export default TopicNavBar;