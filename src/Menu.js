import React from 'react';
import ReactModal from 'react-modal'

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

    render() {
        return <div style={{display: "flex"}}>
            TASK TRACKER
            <button onClick={() => this.handleOpenCreateModal('ToDo')}>Create Task</button>
            <button onClick={() => this.handleOpenCreateModal('Project')}>Create Project</button>

            {/*Create modal*/}
            <ReactModal
                isOpen={this.state.showCreateModal}
                onRequestClose={this.handleCloseCreateModal}
                appElement={document.getElementById('root')}
                style={{overlay: {zIndex: 1000}}}
            >
                <h2>{"Create " + this.state.createModalType}</h2>
                <form>
                    <label> Name: <input type="text" value={this.state.formName} onChange={this.handleChange}/> </label>
                </form>
                {this.state.formName == null || this.state.formName === "" ?
                    null
                    :
                    <button onClick={this.handleCloseCreateModal}>Create</button>
                }
            </ReactModal>

            {/*Confirm modal*/}
            <ReactModal
                isOpen={this.state.showConfirmModal}
                onRequestClose={this.handleCloseConfirmModal}
                appElement={document.getElementById('root')}
                style={{overlay: {zIndex: 1000}}}
            >
                {this.state.isLoading ?
                    <h2>Loading...</h2>
                    :
                    <h2>{this.state.isSuccess ? "Action completed successfully" : "Action failed successfully"}</h2>
                }
                {this.state.confirmModalMessage}<br/>
                {this.state.isLoading ? null : <button onClick={this.handleCloseConfirmModal}>Close</button>}
            </ReactModal>
        </div>
    }
}