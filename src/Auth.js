import React from 'react'

export default class Auth {
    static isLoggedIn() {
        return this.getAuthHeader() != null;
    }

    static logOut() {
        localStorage.removeItem("Authorization");
        localStorage.removeItem("userId")
    }

    static getAuthHeader() {
        return localStorage.getItem("Authorization");
    }

    static getUserId() {
        return localStorage.getItem("userId");
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
            let resp = await response.json();
            localStorage.setItem("Authorization", auth);
            localStorage.setItem("userId", resp.id);
            return true;
        } else {
            return false;
        }
    }
};

