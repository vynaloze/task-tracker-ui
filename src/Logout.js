import React from "react";
import { Link } from "react-router-dom";
import Auth from "./Auth";

const Logout = () => {
    Auth.logOut();
    return (
        <div>
            <h1>You have been logged out!</h1>
            <Link to="/login">Log In</Link>
        </div>
    );
};

export default Logout;