import React from 'react';
import {Redirect} from "react-router-dom";
import Auth from './Auth'
import {Link} from "react-router-dom";


export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToReferrer: false,
            username: null,
            password: null,
            error: ""
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    async handleLogin() {
        const success = await Auth.logIn(this.state.username, this.state.password);
        if (success) {
            this.setState({
                redirectToReferrer: true,
                error: ""
            });
        } else {
            this.setState({
                error: "Invalid email or password"
            })
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.handleLogin();
        }
    };

    render() {
        let {from} = this.props.location.state || {from: {pathname: "/"}};
        let {redirectToReferrer} = this.state;

        if (redirectToReferrer) return <Redirect to={from}/>;

        return (
            <div className="container">
                <h2>Log In</h2>
                <div className="mt-2 col-md-12">
                    <div>
                        <input name="username" type="text" value={this.state.username}
                               onChange={this.handleChange} autoFocus={true} placeholder="Username"/>
                    </div>
                    <div>
                        <input name="password" type="text" value={this.state.password}
                               onChange={this.handleChange} placeholder="Password" onKeyPress={this.handleKeyPress}/>
                    </div>
                </div>
                <div className="text-danger mt-2 col-md-12">
                    {this.state.error}
                </div>
                <div className="mt-2 col-md-12">
                    <button className="btn btn-dark btn-sm" onClick={this.handleLogin}>Log In</button>
                </div>
                <div className="row mt-2 col-md-12">
                    <div className="col">
                        <Link to="/register">
                            <button className="btn btn-dark btn-sm">Register</button>
                        </Link>
                    </div>
                    <div className="col">
                        <button className="btn btn-dark btn-sm">Forgot password?</button>
                    </div>
                </div>
            </div>
        );
    }
}