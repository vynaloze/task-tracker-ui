import React from 'react';
import {Link} from "react-router-dom";
import Auth from "./Auth";

export default class ForgotPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            successMsg: "",
            errorMsg: ""
        };

        this.handleReset = this.handleReset.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
                        successMsg: "Email with reset link has been sent. Please check your inbox."
                    });
                } else {
                    const err = await result.json();
                    console.log(err);
                    this.setState({
                        errorMsg: JSON.stringify(err)
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
        this.post("http://localhost:3000/api/Users/ForgotPassword",
            '"' + this.state.email + '"')
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <div className="container">
                <h2>Reset Password</h2>
                <div className="mt-2 col-md-12">
                    <input name="email" type="text" value={this.state.email} autoFocus={true}
                           onChange={this.handleChange} placeholder="Email"/>
                </div>
                <div className="text-success mt-2 col-md-12">
                    {this.state.successMsg}
                </div>
                <div className="text-danger mt-2 col-md-12">
                    {this.state.errorMsg}
                </div>
                <div className="mt-2 col-md-12">
                    <button className="btn btn-dark btn-sm" onClick={this.handleReset}>Reset Password</button>
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