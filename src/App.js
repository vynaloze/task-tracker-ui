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
                <div>
                    <Link to="/">Home</Link>
                    <Link to="/logout">Logout</Link>

                    <PrivateRoute exact path="/" component={Home}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/logout" component={Logout}/>
                </div>
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