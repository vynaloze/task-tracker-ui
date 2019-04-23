import React from 'react'

export default class Auth {
    static userId = null;

    static isLoggedIn() {
        return this.getAuthHeader() != null;
    }

    static logOut() {
        localStorage.removeItem("Authorization");
        Auth.userId = null;
    }

    static getAuthHeader() {
        return localStorage.getItem("Authorization");
    }

    static logIn = async (username, password) => {
        const auth = 'Basic ' + btoa(username + ":" + password);
        const response = await fetch("http://localhost:3000/api/Users/whoami", {
            headers: new Headers({
                'Authorization': auth,
                'Content-Type': 'application/json'
            })
        });
        const status = await response.status;
        if (status === 200) {
            localStorage.setItem("Authorization", auth);
            Auth.userId = await response.json()["id"];
            return true;
        } else {
            return false;
        }
    }
};

