import React from 'react';
import Auth from "./Auth";

export default class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            firstName: null,
            lastName: null,
            success: "",
            error: ""
        };

        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        fetch("http://localhost:3000/api/Users/whoami",
            {
                headers: new Headers({
                    'Authorization': Auth.getAuthHeader(),
                    'Content-Type': 'application/json'
                })
            })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        user: result,
                        firstName: result.firstname,
                        lastName: result.lastname
                    });
                },
                (error) => {
                    this.setState({
                        error: error.message
                    });
                }
            );
    }

    put(url, data) {
        fetch(url, {
            method: 'PUT',
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
                        success: "Updated.",
                        error: ""
                    });
                } else {
                    const err = await result.json();
                    console.log(err);
                    this.setState({
                        success: "",
                        error: JSON.stringify(err)
                    });
                }
            },
            async (error) => {
                const err = await error.json();
                this.setState({
                    success: "",
                    error: JSON.stringify(err)
                });
            }
        )
    }

    handleUpdate() {
        let user = this.state.user;
        user.firstname = this.state.firstName;
        user.lastname = this.state.lastName;
        this.put("http://localhost:3000/api/Users/" + this.state.user.id, JSON.stringify(user));
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <div className="container">
                <h2>Set Account Information</h2>
                <div className="mt-2 col-md-12">
                    <div>
                        <label>First Name:
                            <input name="firstName" type="text" value={this.state.firstName}
                                   onChange={this.handleChange} placeholder="First Name"/>
                        </label>
                    </div>
                    <div>
                        <label>Last Name:
                            <input name="lastName" type="text" value={this.state.lastName}
                                   onChange={this.handleChange} placeholder="Last Name"/>
                        </label>
                    </div>
                </div>
                <div className="text-success mt-2 col-md-12">
                    {this.state.success}
                </div>
                <div className="text-danger mt-2 col-md-12">
                    {this.state.error}
                </div>
                <div className="mt-2 col-md-12">
                    <button className="btn btn-dark btn-sm" onClick={this.handleUpdate}>Update</button>
                </div>
            </div>
        )
    }
}