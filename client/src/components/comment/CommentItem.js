import React from 'react';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Queries from "../../graphql/queries";
const { FETCH_COMMENT } = Queries;

class CommentItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			edit: false,
			comment: ""
		}
	}

	render() {
		const { comment } = this.props;
		return (
			<Query
				query={FETCH_COMMENT}
				variables={{ id: this.props.match.params.commentId }}
			>
				{({ loading, error, data, comment }) =>
				{
					if (loading) return <h1>Loading...</h1>;
					return (
						<div onClick={() => this.setState({ edit: true })}>
							{/* <h1>Details About {data.comment.comment}</h1> */}
							<p>Comment: {this.props.comment.comment}</p>
							{/* <CommentEdit
								commment={data.comment}
								history={this.props.history}
								edit={this.state.edit}
							/> */}
						</div>
					);
				}}
			</Query>
		)
	}
}

export default CommentItem;