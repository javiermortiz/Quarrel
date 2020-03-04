import React from "react";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import Queries from "../../graphql/queries";
const { SIMILAR_QUESTIONS } = Queries;

class SearchResults extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        const query = this.props.match.params.query.split("-").join(" ")
        return (
            <div className="search-results">
                <ul className="search-results-list">
                    <div className="results-for">Results for <strong>{query}</strong> </div>
                    <Query query={SIMILAR_QUESTIONS} variables={{ question: query }}>
                        {({ loading, error, data }) => {
                            if (loading) return "loading...";
                            if (error) return `Error! ${error.message}`;
                            if (data.similarQuestions.length === 0) return <li id="no-results"><strong>0</strong> results found</li>;
                            return data.similarQuestions.map(match => {
                                return <Link to={`/q/${match._id}`}><li>{match.question}</li></Link>
                            })
                        }}
                    </Query>
                </ul>
            </div>
        )
    }
}

export default SearchResults;