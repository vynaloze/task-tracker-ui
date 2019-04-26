import React from 'react';
import ReactModal from 'react-modal'
import styles from './modal.css.js'
import Auth from "./Auth";

export default class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showCreateModal: false,
            createModalType: "ToDo",
            formName: "",
            showConfirmModal: false,
            isLoading: false,
            isSuccess: true,
            confirmModalMessage: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleOpenCreateModal = this.handleOpenCreateModal.bind(this);
        this.handleCloseCreateModal = this.handleCloseCreateModal.bind(this);
        this.handleCloseConfirmModal = this.handleCloseConfirmModal.bind(this);
        this.handleDisplayOptionsChange = this.handleDisplayOptionsChange.bind(this);
    }

    handleChange(event) {
        this.setState({formName: event.target.value});
    }

    handleOpenCreateModal(type) {
        this.setState({
            showCreateModal: true,
            createModalType: type
        });
    }

    handleCloseCreateModal() {
        if (this.state.formName == null || this.state.formName === "") {
            this.setState({
                showCreateModal: false
            });
            return;
        }

        this.setState({
            showCreateModal: false,
            isLoading: true,
            showConfirmModal: true,
            confirmModalMessage: "Please wait..."
        });

        this.post("http://localhost:3000/api/" + this.state.createModalType + "s",
            JSON.stringify({name: this.state.formName}),
            this.state.createModalType + " " + this.state.formName + " created",
            this.state.createModalType + " " + this.state.formName + " was not created: ");

    }

    handleCloseConfirmModal() {
        this.setState({showConfirmModal: false});
        this.props.reloadParentData();
    }

    post(url, data, successMsg, errorMsg) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': Auth.getAuthHeader(),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: data
        }).then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoading: false,
                        isSuccess: true,
                        confirmModalMessage: successMsg
                    });
                },
                (error) => {
                    this.setState({
                        isLoading: false,
                        isSuccess: false,
                        confirmModalMessage: errorMsg + error.message
                    });
                }
            )
    }

    handleDisplayOptionsChange(event) {
        this.props.onDisplayOptionsChange(event.target.name, event.target.checked);
    }

    render() {
        return <div className="container-fluid bg-secondary text-white">
            <div className="row">
                <div className="col-6">
                    <div className="row">
                        <div className="col-2">
                            <button className="btn btn-default btn-sm"
                                    onClick={() => this.handleOpenCreateModal('ToDo')}>Create Task
                            </button>
                        </div>
                        <div className="col-10">
                            <button className="btn btn-default btn-sm"
                                    onClick={() => this.handleOpenCreateModal('Project')}>Create Project
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-2">
                    <label>
                        Show Only Mine:
                        <input
                            name="showOnlyMine"
                            type="checkbox"
                            checked={this.state.showOnlyMine}
                            defaultChecked={true}
                            onChange={this.handleDisplayOptionsChange}/>
                    </label>
                </div>
                <div className="col-2">
                    <label>
                        Show Finished:
                        <input
                            name="showFinished"
                            type="checkbox"
                            checked={this.state.showFinished}
                            onChange={this.handleDisplayOptionsChange}/>
                    </label>
                </div>
                <div className="col-2">
                    <label>
                        Show Assigned:
                        <input
                            name="showAssigned"
                            type="checkbox"
                            checked={this.state.showAssigned}
                            onChange={this.handleDisplayOptionsChange}/>
                    </label>
                </div>
            </div>

            {/*Create modal*/}
            <ReactModal
                isOpen={this.state.showCreateModal}
                onRequestClose={this.handleCloseCreateModal}
                appElement={document.getElementById('root')}
                style={styles.modal}
            >
                <div className="container-fluid">
                    <h2>{"Create " + this.state.createModalType}</h2>
                    <div className="row justify-content-between">
                        <div className="col-6">
                            <form>
                                <label> Name: <input type="text" value={this.state.formName}
                                                     onChange={this.handleChange}/> </label>
                            </form>
                        </div>
                        <div className="col-2">
                            {this.state.formName == null || this.state.formName === "" ?
                                null
                                :
                                <button className="btn btn-dark btn-sm" onClick={this.handleCloseCreateModal}>Create</button>
                            }
                        </div>
                    </div>
                </div>
            </ReactModal>

            {/*Confirm modal*/}
            <ReactModal
                isOpen={this.state.showConfirmModal}
                onRequestClose={this.handleCloseConfirmModal}
                appElement={document.getElementById('root')}
                style={styles.modal}
            >
                <div className="container-fluid">
                    {this.state.isLoading ?
                        <h2>Loading...</h2>
                        :
                        <h2>{this.state.isSuccess ? "Action completed successfully" : "Action failed successfully"}</h2>
                    }
                    <div className="row justify-content-between">
                        <div className="col-6">
                            {this.state.confirmModalMessage}
                        </div>
                        <div className="col-2">
                            {this.state.isLoading ? null :
                                <button className="btn btn-dark btn-sm" onClick={this.handleCloseConfirmModal}>Close</button>}
                        </div>
                    </div>
                </div>
            </ReactModal>
        </div>
    }
}