import React from "react";
import ReactModal from "react-modal";
import Select from 'react-select';


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
    }

    componentDidMount() {
        this.loadProjects();
    }

    loadProjects() {
        fetch("http://localhost:3000/api/Projects")
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
            method: 'PATCH'
        }).then(
            (result) => {
                if(result.ok){
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

    render() {
        return(
            <ReactModal
                isOpen={this.props.show}
                onRequestClose={this.props.onClose}
                appElement={document.getElementById('root')}
                style={{overlay: {zIndex: 1000}}}
            >
                <h2>Assign To Project</h2>
                {this.state.stateSelect ?
                    <div>
                        <Select
                            value={this.state.selectedProject}
                            onChange={this.handleChange}
                            options={this.state.data}
                        />
                        <button onClick={this.handleProjectAssignment}>Submit</button>
                    </div>
                    : null}
                {this.state.stateWaiting ? "Please wait..." : null}
                {this.state.stateSuccess ?
                    <div> Successfully assigned. <button onClick={this.props.onClose}>OK</button></div> : null}
                {this.state.stateError ? <div> Task failed successfully: {this.state.error}
                    <button onClick={this.props.onClose}>OK</button>
                </div> : null}
            </ReactModal>
        )
    }
}