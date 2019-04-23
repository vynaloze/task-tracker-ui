import React from "react";
import ReactTable from "react-table";
import Auth from "./Auth"
import ReactModal from "react-modal";
import Select from 'react-select';

export default class ToDoTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            stateSelect: false,
            stateWaiting: false,
            stateSuccess: false,
            stateError: false,
            error: null,
            todoId: null,
            selectedProject: null,
            data: null
        };
        this.handleUserAssignment = this.handleUserAssignment.bind(this);
        this.handleProjectAssignment = this.handleProjectAssignment.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.loadProjects = this.loadProjects.bind(this);
    }

    componentDidMount() {
        this.loadProjects();
    }

    handleUserAssignment(todoId, userId) {
        fetch("http://localhost:3000/api/ToDos/" + todoId + "/User/" + userId, {
            method: 'PATCH'
        }).then(
            (result) => {
                this.props.reloadParentData();
            },
            (error) => {
                let res = error.json();
                alert(res.message)
            }
        )
    }

    handleOpenModal(todoId) {
        this.setState({
            showModal: true,
            stateSelect: true,
            stateWaiting: false,
            stateSuccess: false,
            stateError: false,
            todoId: todoId
        });
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
                        showModal: true,
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
        fetch("http://localhost:3000/api/ToDos/" + this.state.todoId + "/Project/" + this.state.selectedProject.value, {
            method: 'PATCH'
        }).then(
            (result) => {
                if(result.ok){
                    this.setState({
                        showModal: true,
                        stateSelect: false,
                        stateWaiting: false,
                        stateSuccess: true,
                        stateError: false
                    });
                } else {
                    const err = result.json();
                    this.setState({
                        showModal: true,
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
                    showModal: true,
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

    handleCloseModal() {
        this.setState({
            showModal: false
        });
        this.props.reloadParentData();
    }

    render() {
        let columns = [{
            Header: 'Task',
            accessor: 'name'
        }, {
            id: 'projectName',
            Header: 'Project',
            accessor: d => d.project != null ? d.project.name : "",
            Cell: props => {
                if (props.value !== '') {
                    return <div>{props.value}</div>
                }
                return <button onClick={() => this.handleOpenModal(props.original.id)}>Assign</button>
            }
        }, {
            id: 'user',
            Header: 'Assigned User',
            accessor: d => d.user != null ? d.user.firstname + " " + d.user.lastname + " (" + d.user.email + ")" : '',
            Cell: props => {
                if (props.value !== '') {
                    return <div>{props.value}</div>
                }
                return <button onClick={() => this.handleUserAssignment(props.original.id, Auth.getUserId())}>Assign
                    me!</button>
            }
        }, {
            id: 'finished',
            Header: 'Finished',
            accessor: d => d.endTime != null ? 'yes' : 'no'
        }, {
            id: 'startTime',
            Header: 'Started Work',
            accessor: d => d.startTime != null ? d.startTime : ''
        }, {
            id: 'endTime',
            Header: 'Finished Work',
            accessor: d => d.endTime != null ? d.endTime : ''
        }, {
            id: 'duration',
            Header: 'Worked Hours',
            accessor: d => d.endTime != null ? Math.round((new Date(d.endTime) - new Date(d.startTime)) / 36000) / 100 : ''
        }
        ];

        let data = this.props.data;

        if (this.props.showFinished) {
            columns = columns.concat([])
        } else {
            data = data.filter(i => i.endTime == null);
        }

        if (this.props.showOnlyMine) {
            data = data.filter(i => i.user != null && i.user.id === Number(Auth.getUserId()));
        } else {
            if (!this.props.showAssigned) {
                data = data.filter(i => i.user == null);
            }
        }

        return (
            <div>
                <ReactTable
                    className={"-striped -highlight"}
                    defaultPageSize={5}
                    data={data}
                    columns={columns}
                />
                <ReactModal
                    isOpen={this.state.showModal}
                    onRequestClose={this.handleCloseModal}
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
                        <div> Successfully assigned. <button onClick={this.handleCloseModal}>OK</button></div> : null}
                    {this.state.stateError ? <div> Task failed successfully: {this.state.error}
                        <button onClick={this.handleCloseModal}>OK</button>
                    </div> : null}
                </ReactModal>
            </div>
        )
    }
}