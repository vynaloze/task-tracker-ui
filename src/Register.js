import React from 'react';
import {Redirect, Link} from "react-router-dom";

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToLogin: false,
            email: null,
            password: null,
            confirmPassword: null,
            error: ""
        };

        this.handleRegister = this.handleRegister.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.validateInput = this.validateInput.bind(this);
    }

    post(url, data) {
        fetch(url, {
            method: 'POST',
            headers: {
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
                        error: JSON.stringify(err)
                    });
                }
            },
            async (error) => {
                const err = await error.json();
                this.setState({
                    error: JSON.stringify(err)
                });
            }
        )
    }

    handleRegister() {
        const isValid = this.validateInput();
        if (!isValid) {
            return false;
        }
        this.post("http://localhost:3000/api/Users",
            JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                level: 1,
                firstname: "FirstName",
                lastname: "LastName"
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
            this.handleRegister();
        } else {
            this.validateInput();
        }
    };

    render() {
        if (this.state.redirectToLogin) return <Redirect to={"/login?register"}/>;
        return (
            <div className="container">
                <h2>Register</h2>
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
                    {this.state.error}
                </div>
                <div className="mt-2 col-md-12">
                    <button className="btn btn-dark btn-sm" onClick={this.handleRegister}>Register</button>
                </div>
                <div className="row mt-2 col-md-12">
                    <div className="col">
                        <Link to="/login">
                            <button className="btn btn-dark btn-sm">Login</button>
                        </Link>
                    </div>
                    <div className="col">
                        <Link to="/forgot">
                            <button className="btn btn-dark btn-sm">Forgot password?</button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}