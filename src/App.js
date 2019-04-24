import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect
} from "react-router-dom";

import Home from './Home';
import Login from './Login';
import Logout from './Logout';
import Auth from './Auth'

export default class App extends Component {
    render() {
        return (
            <Router>
                <div className="navbar bg-dark navbar-dark">
                    <div className="container-fluid text-white">
                        <div className="navbar-brand">Task Tracker</div>
                            <ul className="navbar-nav">
                                <li className="nav-item-active">
                                    <Link className="text-white" to="/">Home</Link>
                                </li>
                            </ul>
                            <ul className="nav navbar-nav">
                                <li className="nav-item">
                                    <Link className="text-white" to="/account">Account</Link>
                                </li>
                            </ul>
                            <ul className="nav navbar-nav">
                                <li className="nav-item">
                                    <Link className="text-white" to="/logout">Logout</Link>
                                </li>
                            </ul>
                    </div>
                </div>
                <PrivateRoute exact path="/" component={Home}/>
                <Route path="/login" component={Login}/>
                <Route path="/logout" component={Logout}/>
            </Router>
        );
    }
}

function PrivateRoute({component: Component, ...rest}) {
    return (
        <Route
            {...rest}
            render={props =>
                Auth.isLoggedIn() ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: {from: props.location}
                        }}
                    />
                )
            }
        />
    );
}