import React from "react";
import ReactModal from "react-modal";
import Select from 'react-select';
import styles from './modal.css.js'
import Auth from "./Auth";


export default class ToDoTableAssignProject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stateSelect: true,
            stateWaiting: false,
            stateSuccess: false,
            stateError: false,
            error: null,
            selectedProject: null,
            data: null
        };
        this.handleProjectAssignment = this.handleProjectAssignment.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.loadProjects = this.loadProjects.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        this.loadProjects();
    }

    loadProjects() {
        fetch("http://localhost:3000/api/Projects", {headers: {'Authorization': Auth.getAuthHeader()}})
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        data: result.map(p => {
                            return {value: p.id, label: p.name}
                        })
                    });
                },
                (error) => {
                    this.setState({
                        stateSelect: false,
                        stateWaiting: false,
                        stateSuccess: false,
                        stateError: true,
                        error: error.message
                    });
                }
            );
    }

    handleProjectAssignment() {
        fetch("http://localhost:3000/api/ToDos/" + this.props.todoId + "/Project/" + this.state.selectedProject.value, {
            method: 'PATCH',
            headers: {'Authorization': Auth.getAuthHeader()}
        }).then(
            (result) => {
                if (result.ok) {
                    this.setState({
                        stateSelect: false,
                        stateWaiting: false,
                        stateSuccess: true,
                        stateError: false
                    });
                } else {
                    const err = result.json();
                    this.setState({
                        stateSelect: false,
                        stateWaiting: false,
                        stateSuccess: false,
                        stateError: true,
                        error: err.message
                    });
                }
            },
            (error) => {
                const res = error.json();
                this.setState({
                    stateSelect: false,
                    stateWaiting: false,
                    stateSuccess: false,
                    stateError: true,
                    error: res.message
                });
            }
        )
    }

    handleChange(selected) {
        this.setState({selectedProject: selected});
    }

    handleClose() {
        this.setState({
            stateSelect: true,
            stateWaiting: false,
            stateSuccess: false,
            stateError: false,
            error: null,
            startDate: null,
            endDate: null
        });
        this.props.onClose();
    }

    render() {
        return (
            <ReactModal
                isOpen={this.props.show}
                onRequestClose={this.props.onClose}
                appElement={document.getElementById('root')}
                style={styles.modalLong}
            >
                <h2>Assign To Project</h2>
                <div className="container-fluid">
                    {this.state.stateSelect ?
                        <div className="row justify-content-between">
                            <div className="col-6">
                                <Select
                                    value={this.state.selectedProject}
                                    onChange={this.handleChange}
                                    options={this.state.data}
                                />
                            </div>
                            <div className="col-2">
                                {this.state.selectedProject != null ?
                                    <button className="btn btn-dark btn-sm"
                                            onClick={this.handleProjectAssignment}>Submit</button>
                                    : null}
                            </div>
                        </div>
                        : null}
                    {this.state.stateWaiting ? "Please wait..." : null}
                    {this.state.stateSuccess ?
                        <div className="row justify-content-between">
                            <div className="col-6">
                                Successfully assigned.
                            </div>
                            <div className="col-2">
                                <button className="btn btn-dark btn-sm" onClick={this.handleClose}>OK</button>
                            </div>
                        </div> : null}
                    {this.state.stateError ?
                        <div className="row justify-content-between">
                            <div className="col-6">
                                Task failed successfully: {this.state.error}
                            </div>
                            <div className="col-2">
                                <button className="btn btn-dark btn-sm" onClick={this.handleClose}>OK</button>
                            </div>
                        </div> : null}
                </div>
            </ReactModal>
        )
    }
}