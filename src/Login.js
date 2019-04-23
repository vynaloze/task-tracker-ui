import React from 'react';
import ReactSignupLoginComponent from 'react-signup-login-component';
import {Redirect} from "react-router-dom";
import Auth from './Auth'
import ReactModal from "react-modal";


export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToReferrer: false,
            showConfirmModal: false,
            isLoading: true,
            confirmModalTitle: "",
            confirmModalMessage: ""
        };

        this.registerCallback = this.registerCallback.bind(this);
        this.loginCallback = this.loginCallback.bind(this);
        this.resetPasswordCallback = this.resetPasswordCallback.bind(this);
        this.handleCloseConfirmModal = this.handleCloseConfirmModal.bind(this);
    }

    post(url, data, successMsg, errorMsg) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: data
        }).then(res => res.json())
            .then(
                (result) => {
                    if (result.id != null) { // means it was ok. Sorry for that.
                        this.setState({
                            isLoading: false,
                            confirmModalMessage: successMsg
                        });
                    } else {
                        let error;
                        if(result.title == null) {
                            error = result;
                        } else {
                            error = result.title;
                        }
                        this.setState({
                            isLoading: false,
                            confirmModalMessage: errorMsg + error
                        });
                    }
                },
                (error) => {
                    this.setState({
                        isLoading: false,
                        confirmModalMessage: errorMsg + error.message
                    });
                }
            )
    }

    registerCallback(data) {
        this.setState({
            isLoading: true,
            showConfirmModal: true,
            confirmModalTitle: "Registering new user",
            confirmModalMessage: "Please wait..."
        });

        this.post("http://localhost:3000/api/Users",
            JSON.stringify({
                email: data.username,
                password: data.password,
                level: 1,
                firstname: "FirstName",
                lastname: "LastName"
            }),
            "New user " + data.username + " created",
            "New user " + data.username + " was not created. Reason: ");
    }

    async loginCallback(data) {
        const success = await Auth.logIn(data.username, data.password);
        if (success) {
            this.setState({redirectToReferrer: true});
        } else {
            this.setState({
                showConfirmModal: true,
                isLoading: false,
                confirmModalTitle: "Login failed",
                confirmModalMessage: "Invalid email or password"
            })
        }
    }

    resetPasswordCallback(data) {
        console.log(data);
        alert('Recover password callback, see log on the console to see the data.');
    }

    handleCloseConfirmModal() {
        this.setState({showConfirmModal: false});
    }

    render() {
        let {from} = this.props.location.state || {from: {pathname: "/"}};
        let {redirectToReferrer} = this.state;

        if (redirectToReferrer) return <Redirect to={from}/>;

        return (
            <div>
                <ReactSignupLoginComponent
                    title="Task Tracker"
                    handleSignup={this.registerCallback}
                    handleLogin={this.loginCallback}
                    handleRecoverPassword={this.resetPasswordCallback}
                    usernameCustomLabel="Email"
                    passwordCustomLabel="Password"
                    passwordConfirmationCustomLabel="Confirm Password"
                    recoverPasswordCustomLabel="Reset Password"
                    signupCustomLabel="Register"
                    submitLoginCustomLabel="Login"
                    goToLoginCustomLabel="Return to login"
                    submitSignupCustomLabel="Submit"
                    goToSignupCustomLabel="Register"
                    submitRecoverPasswordCustomLabel="Reset"
                />
                {/*Confirm modal*/}
                <ReactModal
                    isOpen={this.state.showConfirmModal}
                    onRequestClose={this.handleCloseConfirmModal}
                    appElement={document.getElementById('root')}
                    style={{overlay: {zIndex: 1000}}}
                >
                    <h2>{this.state.confirmModalTitle}</h2>
                    {this.state.confirmModalMessage}<br/>
                    {this.state.isLoading ? null : <button onClick={() => this.handleCloseConfirmModal}>Close</button>}
                </ReactModal>
            </div>
        );
    }
}