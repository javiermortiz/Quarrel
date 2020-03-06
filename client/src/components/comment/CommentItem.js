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
						<div onClick={() => this.setState({ edit: true })} className="comment-item-container">
							{/* <h1>Details About {data.comment.comment}</h1> */}
							<div className="comment-item-header">
								<div className="comment-item-user-icon">Profile picture</div>
								<div className="comment-item-user-info">First name, Last name</div>
							</div>
							<div className="comment-item-content">Comment: {this.props.comment.comment}</div>
							{/* <CommentEdit
								commment={data.comment}
								history={this.props.history}
								edit={this.state.edit}
							/> */}
							<div className="comment-item-footer"></div>
						</div>
					);
				}}
			</Query>
		)
	}
}

export default CommentItem;