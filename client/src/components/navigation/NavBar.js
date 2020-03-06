import React from 'react';
import { Link, withRouter } from "react-router-dom";
import Queries from "../../graphql/queries";
import { ApolloConsumer, Query } from "react-apollo"
import SearchBar from "./SearchBar";
import QuestionForm from "../questions/QuestionForm";
import * as SessionUtil from "../../util/session_util";
import SigninButton from "./SigninButton";
import ProfileUpload from "./ProfileUpload";
const { IS_LOGGED_IN } = Queries;

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            isLoggedIn: "",
            client: "",
            showModal: false,
            searchFocus: ""
        };
        this.handleModal = this.handleModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
	}
		
    logout(client) {
        return (
            <div>
                <button
                    className="nav-ask-btn"
                    onClick={e => {
                        e.preventDefault();
                        localStorage.removeItem("auth-token");
                        client.writeData({ data: { isLoggedIn: false } });
                        this.props.history.push("/logout");
                    }}
                >
                    Logout
            </button>
            </div>
        )
    }
		

    handleModal (e) {
        e.preventDefault();
        this.setState({ showModal: !this.state.showModal });
    }

    openModal(e) {
        e.preventDefault();
        this.setState({ showModal: true, searchFocus: "search-focus" });
    }

    closeModal(e) {
        e.preventDefault();
        this.setState({ showModal: false, searchFocus: "" });
    }

    render() {
        let { logout } = this.logout;
        return (
            <div className="nav-container">
                <div className="nav-content">
                    <div className="nav-logo" onClick={this.closeModal}>
                        <Link to="/">Quarrel</Link>
                    </div>
                    <ul className="nav-links" onClick={this.closeModal}>
                        <Link to="/">
                            <li className="nav-home">
                                <i className="far fa-list-alt"></i>
                                <span>Home</span>
                            </li>
                        </Link>
                        <Link to="/answer">
                            <li className="nav-answer">
                                <i className="far fa-edit"></i>
                                <span>Answer</span>
                            </li>
                        </Link>
                        <Link to="/topics">
                            <li className="nav-topics">
                                <i className="far fa-comments"></i>
                                <span>Topics</span>
                            </li>
                        </Link>
                        <li className="nav-notifications">
                            <i className="far fa-bell"></i>
                            <span>Notifications</span>
                        </li>
                    </ul>
                    <SearchBar 
                        openModal={this.openModal} 
                        closeModal={this.closeModal} 
                        showModal={this.state.showModal} 
                        searchFocus={this.state.searchFocus}
                    />
                    <QuestionForm closeSearchModal={this.closeModal}/>
										<SigninButton />
                    <ProfileUpload />
                </div>
                {this.state.showModal && <div className="search-modal-background" onClick={this.closeModal}></div>}
            </div>
				)}};

export default NavBar;