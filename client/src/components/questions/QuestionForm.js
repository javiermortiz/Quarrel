import React from "react";
import { Mutation, Query } from "react-apollo";
import Queries from "../../graphql/queries";
import Mutations from "../../graphql/mutations";
import { FaLink } from "react-icons/fa";
import { Link, withRouter } from "react-router-dom";

const Validator = require("validator");
const { FETCH_QUESTIONS, CURRENT_USER, SIMILAR_QUESTIONS } = Queries;
const { NEW_QUESTION } = Mutations;


class QuestionForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: "",
            message: "",
            showModal: false,
            success: "",
            link: "",
            successfulQuestion: "",
            successfulQId: "",
            redirectId: ""
        };
        this.handleModal = this.handleModal.bind(this);
        this.closeMessage = this.closeMessage.bind(this);
        this.redirect = this.redirect.bind(this);
    }


    componentDidUpdate(prevProps, prevState) {
        if (prevState.redirectId !== this.state.redirectId) {
            this.props.history.push(`/q/${this.state.redirectId}`);
        }
    }

    redirect(id) {
        return e => {
            this.setState({
                showModal: false,
                redirectId: id
            });
        }
    }

    handleModal(e) {
        e.preventDefault();
        this.props.closeSearchModal(e);
        this.setState({
            showModal: !this.state.showModal,
            message: "",
            success: "",
            question: "",
            link: "",
            successfulQuestion: "",
            successfulQId: ""
        });
    }

    closeMessage(e) {
        this.setState({ message: "" })
    }

    update(field) {
        return e => this.setState({ [field]: e.currentTarget.value })
    }

    updateCache(cache, { data }) {
        let questions;
        try {
            questions = cache.readQuery({ query: FETCH_QUESTIONS });
        } catch (err) {
            return;
        }
        if (questions) {
            let questionArray = questions.questions;
            let newQuestion = data.newQuestion;
            cache.writeQuery({
                query: FETCH_QUESTIONS,
                data: { questions: questionArray.concat(newQuestion) }
            });
        }
    }

    handleSubmit(e, newQuestion) {
        e.preventDefault();
        const question = this.state.question;
        const link = this.state.link;
        if (question.split(" ").length < 3) {
            this.setState({
                message: "This question needs more detail. " +
                    "Add more information to ask a clear question, " +
                    "written as a complete sentence."
            });
            setTimeout(this.closeMessage, 5001)
        } else if (link.length === 0 || Validator.isURL(link)) {
            newQuestion({
                variables: {
                    question: question,
                    link: link
                }
            });
            setTimeout(this.closeMessage, 5001)
        } else {
            this.setState({ message: "The source should be a valid link." })
            setTimeout(this.closeMessage, 5001)
        }
    }

    capitalize(word) {
        return word[0].toUpperCase() + word.slice(1);
    }

    render() {
        let matchesList = "";
        let questionLength = this.state.question.length;
        if (questionLength > 1) {
            matchesList = (
                <Query query={SIMILAR_QUESTIONS} variables={{ question: this.state.question }}>
                    {({ loading, error, data }) => {
                        if (loading) return "loading...";
                        if (error) return `Error! ${error.message}`;
                        return data.similarQuestions.map(match => {
                            return (
                                <li className="matches-item" onClick={this.redirect(match._id)}>
                                    <div>{`${match.question}`}</div>
                                    <div className="question-form-answers-number">
                                        {`${match.answers.length} ${match.answers.length === 1 ? "answer" : "answers"}`}
                                    </div>
                                </li>
                            )
                        })
                    }}
                </Query>
            )
        }
        const button = (
            <div className="modal-background" onClick={this.handleModal}>
                <div className="modal-child" onClick={e => e.stopPropagation()}>
                    <Mutation
                        mutation={NEW_QUESTION}
                        onError={err => this.setState({ message: err.message })}
                        update={(cache, data) => this.updateCache(cache, data)}
                        onCompleted={data => {
                            const { question } = data.newQuestion;
                            this.setState({
                                message: `You asked: `,
                                success: 'success',
                                showModal: false,
                                question: "",
                                link: "",
                                successfulQuestion: `${question}`,
                                successfulQId: data.newQuestion._id
                            });
                        }}
                    >
                        {(newQuestion, { data }) => (
                            <div className="add-question-modal">
                                <div className="modal-header">
                                    <div className="add-question-modal-header">
                                        <div className="tab selected">Add Question</div>
                                        {/* <div className="tab">Share Link</div> */}
                                    </div>
                                    <div className="add-question-modal-x">
                                        <span onClick={this.handleModal}>X</span>
                                    </div>
                                </div>
                                <form onSubmit={e => this.handleSubmit(e, newQuestion)}>
                                    <div className="add-question-modal-content">
                                        <Query
                                            query={CURRENT_USER} variables={{ token: localStorage.getItem("auth-token") }}>

                                            {({ loading, error, data }) => {
                                                if (loading) return "Loading...";
                                                if (error) return `Error! ${error.message}`
                                                return (
                                                    <div className="add-question-modal-user">
                                                        <img className="question-modal-user-pic" src={data.currentUser.profileUrl} />
                                                        <div className="question-modal-user-name">
                                                            {`${this.capitalize(data.currentUser.fname)} ${this.capitalize(data.currentUser.lname)} asked`}
                                                        </div>
                                                    </div>
                                                )
                                            }}
                                        </Query>
                                        <div className="add-question-modal-question">
                                            <textarea
                                                onChange={this.update("question")}
                                                value={this.state.question}
                                                placeholder='Start your question with "What", "How", "Why", etc.'
                                            />
                                            <ul className="matches-list">
                                                {matchesList}
                                            </ul>
                                        </div>
                                        <div className="add-question-modal-link">
                                            <span><FaLink /></span>
                                            <input
                                                onChange={this.update("link")}
                                                value={this.state.link}
                                                placeholder="Optional: include a link that gives context"
                                            />
                                        </div>
                                    </div>
                                    <div className="add-question-modal-footer">
                                        <p onClick={this.handleModal}>Cancel</p>
                                        <button type="submit">Add Question</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </Mutation>
                </div>
            </div>
        )
        return (
            <div>
                {
                    this.state.message.length > 0 &&
                    <div className={`modal-message hide-me ${this.state.success}`}>
                        <div className="hidden">x</div>
                        <p>{this.state.message}<Link to={`/q/${this.state.successfulQId}`}>{this.state.successfulQuestion}</Link></p>
                        <div className="close-message" onClick={this.closeMessage}>x</div>
                    </div>
                }
                {/* <div className="add-question-item" onClick={this.handleModal}>
                    <p className="add-question-item-user">Username</p>
                    <p className="add-question-item-prompt">What is your question or link?</p>
                </div> */}
                <button className="nav-ask-btn" onClick={this.handleModal}>Add Question</button>
                {this.state.showModal && button}
            </div>
        )
    }
}

export default withRouter(QuestionForm);