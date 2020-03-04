import React from 'react';
import { Mutation } from "react-apollo";
import Mutations from "../../graphql/mutations";
import * as SessionUtil from "../../util/session_util";

const { LOGIN_USER } = Mutations;

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: "",
			errors: [],
			errorArray: [],
			errorMessage: "",
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.demoLogin = this.demoLogin.bind(this);
		this.handleGraphQLError.bind(this);
	}

	componentDidMount()
	{
		this._isMounted = true;
	}

	componentWillUnmount()
	{
		this.setState({ errorMessage: "" });
		this._isMounted = false;
	}

	update(field) {
		return e => this.setState({ [field]: e.target.value });
	}

	updateCache(client, { data }) {
		SessionUtil.saveUserToCache(client, data.login);
		// console.log(data);
		// client.writeData({
		// 	data: { isLoggedIn: data.login.loggedIn }
		// });
	}

	loginAndRedirectTo(url, data)
	{
		SessionUtil.saveUserToLocalStorage(data.login);
		this.props.history.push(url);
	}

	handleSubmit(Mutation, variables) {
		return e => {
			e.preventDefault();
			Mutation({ variables });
		};
	}
	// handleSubmit(e, loginUser) {
	// 	e.preventDefault();
	// 	loginUser({
	// 		variables: {
	// 			email: this.state.email,
	// 			password: this.state.password
	// 		}
	// 	}).catch(err => console.log(err));
	// }

	demoLogin(e, loginUser) {
		e.preventDefault();
		loginUser({
			variables: {
				email: "demouser@gmail.com",
				password: "password"
			}})
	}

	// renderErrors(errors)
	// {
	// 	let errorArray = errors.map((error) => (
	// 		error.message
	// 	))
	// 	this.setState({ errors: errorArray })
	// 	console.log(errorArray)
	// }

	renderErrorMessage()
	{
		const { errorMessage } = this.state;
		return (errorMessage) ? <p>{SessionUtil.stripGraphQLPrefix(errorMessage)}</p> : null;
	}
	handleGraphQLError(error)
	{
		if (this._isMounted) this.setState({ errorMessage: error.message })
	}
	

	render() {
		const { email, password } = this.state;
		return (
			<Mutation
				mutation={LOGIN_USER}
				onCompleted={data => {
					const { token } = data.login;
					localStorage.setItem("auth-token", token);
					this.loginAndRedirectTo("/", data)
				}}
				// onError={err => this.renderErrors(err.graphQLErrors)}
				onError={error => this.handleGraphQLError(error)}
				update={(client, data) => this.updateCache(client, data)}
			>
				{loginUser => (
					<div>
					<div className="errorMsg">
						{/* {this.state.errors[0]} */}
						{this.state.errors.map(error =>
						{
							return (
								<li key={error}>{error}</li>
							);
						})}
					</div>
					<div className="login-form-box">
						<label className="session-label">Login</label>
						<form
							className="login-form"
								onSubmit={this.handleSubmit(loginUser, {
									email,
									password
								})}
						>
							<div className="form_column">
								<input
									className="text_box"
									value={this.state.email}
									onChange={this.update("email")}
									placeholder="Email"
								/>
							</div>
							<div className="form_column">
							<input
								className="text_box"
								value={this.state.password}
								onChange={this.update("password")}
								type="password"
								placeholder="Password"
								/>
								</div>
							<button type="submit" className="form-button">
								Login
							</button>
							<button
								onClick={e => this.demoLogin(e, loginUser)}
								className="demo-button"
							>
								Demo Login
							</button>
						</form>
					</div>
					</div>
				)}
			</Mutation>
		);
	}
}

export default Login;