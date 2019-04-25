import React from "react";
import { Link } from "react-router-dom";
import Auth from "./Auth";

const Logout = () => {
    Auth.logOut();
    return (
        <div className="container">
            <h2>Log Out</h2>
            <div className="text-success mt-2 col-md-12">
                You've been logged out.
            </div>
            <div className="mt-2 col-md-12">
                <Link to="/login">
                    <button className="btn btn-dark btn-sm">Log In</button>
                </Link>
            </div>
        </div>
    );
};

export default Logout;