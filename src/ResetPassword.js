import React from 'react';
import queryString from 'query-string'
import {Redirect, Link} from "react-router-dom";
import Auth from "./Auth";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            confirmPassword: null,
            token: null,
            errorMsg: ""
        };

        this.handleReset = this.handleReset.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.validateInput = this.validateInput.bind(this);
    }

    componentDidMount() {
        const token = queryString.parse(this.props.location.search).token;
        if(token == null){
            this.setState({errorMsg: "Invalid link. Please try again."})
        }
        this.setState({token: token})
    }

    post(url, data) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': Auth.getAuthHeader(),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: data
        }).then(
            async (result) => {
                if (result.ok) {
                    this.setState({
                        redirectToLogin: true
                    });
                } else {
                    const err = await result.json();
                    console.log(err);
                    this.setState({
                        errorMsg: "Sorry, something went wrong. " +
                            "Make sure that the the email is correct; " +
                            "it is also possible that link is invalid or it has already expired. " +
                            "Please try again."
                    });
                }
            },
            async (error) => {
                const err = await error.json();
                this.setState({
                    errorMsg: JSON.stringify(err)
                });
            }
        )
    }

    handleReset() {
        const isValid = this.validateInput();
        if (!isValid) {
            return false;
        }
        this.post("http://localhost:3000/api/Users/ResetPassword",
            JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                token: this.state.token
            }));
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    validateInput() {
        let errorMsg = "";
        if (this.state.email === "") {
            errorMsg = "Email cannot be null ";
        }
        if (this.state.password === "" || this.state.confirmPassword === "") {
            errorMsg = errorMsg.concat("Password cannot be null ");
        }
        if (this.state.password !== this.state.confirmPassword) {
            errorMsg = errorMsg.concat("Passwords do not match");
        }
        this.setState({error: errorMsg});
        return errorMsg === "";
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.handleUpdate();
        } else {
            this.validateInput();
        }
    };

    render() {
        if (this.state.redirectToLogin) return <Redirect to={"/login?reset"}/>;
        return (
            <div className="container">
                <h2>Reset Password</h2>
                <div className="mt-2 col-md-12">
                    <div>
                        <input name="email" type="text" value={this.state.email} autoFocus={true}
                               onChange={this.handleChange} onBlur={this.validateInput}
                               placeholder="Email"
                               onKeyPress={this.handleKeyPress}/>
                    </div>
                    <div>
                        <input name="password" type="password" value={this.state.password}
                               onChange={this.handleChange} onBlur={this.validateInput}
                               placeholder="Password"
                               onKeyPress={this.handleKeyPress}/>
                    </div>
                    <div>
                        <input name="confirmPassword" type="password" value={this.state.confirmPassword}
                               onChange={this.handleChange} onBlur={this.validateInput}
                               placeholder="Confirm Password"
                               onKeyPress={this.handleKeyPress}/>
                    </div>
                </div>
                <div className="text-danger mt-2 col-md-12">
                    {this.state.errorMsg}
                </div>
                <div className="mt-2 col-md-12">
                    <button className="btn btn-dark btn-sm" onClick={this.handleReset}>Reset</button>
                </div>
                <div className="mt-2 col-md-12">
                    <Link to="/login">
                        <button className="btn btn-dark btn-sm">Back to Log In</button>
                    </Link>
                </div>
            </div>
        )
    }
}