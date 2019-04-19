import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ReactTable from "react-table";
import 'react-table/react-table.css'

class ToDoTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        }
    }

    componentDidMount() {
        fetch("http://localhost:3000/api/ToDos")
            .then(res => {
                console.log(res);
                return res;
            })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() {
        let {error, isLoaded, items} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            let columns = [{
                Header: 'Task',
                accessor: 'name'
            }, {
                id: 'projectName',
                Header: 'Project',
                accessor: d => d.project != null ? d.project.name : "-"
            }, {
                id: 'user',
                Header: 'Assigned User',
                accessor: d => d.user != null ? d.user.firstname + " " + d.user.lastname + " (" + d.user.email + ")" : '-',
                Cell: props => {
                    if (props.value !== '-') {
                        return <div>{props.value}</div>
                    }
                    return <button>Assign me!</button>
                }
            }, {
                id: 'finished',
                Header: 'Finished',
                accessor: d => d.endTime != null ? 'yes' : 'no'
            }, {
                id: 'startTime',
                Header: 'Started Work',
                accessor: d => d.startTime != null ? d.startTime : '-'
            }, {
                id: 'endTime',
                Header: 'Finished Work',
                accessor: d => d.endTime != null ? d.endTime : '-'
            }, {
                id: 'duration',
                Header: 'Worked Hours',
                accessor: d => d.endTime != null ? Math.round((new Date(d.endTime) - new Date(d.startTime)) / 36000) / 100 : '-'
            }
            ];

            if (this.props.showFinished) {
                columns = columns.concat([])
            } else {
                items = items.filter(i => i.endTime == null);
            }
            if (!this.props.showAssigned) {
                items = items.filter(i => i.user == null);
            }

            return (
                <ReactTable
                    className={"-striped -highlight"}
                    defaultPageSize={5}
                    data={items}
                    columns={columns}
                />
            )
        }
    }
}


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAssigned: false,
            showFinished: false
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.checked
        })
    }

    render() {
        return (
            <div>
                <div>
                    <div>
                        General Overview
                    </div>
                    <label>
                        Show Finished:
                        <input
                            name="showFinished"
                            type="checkbox"
                            checked={this.state.showFinished}
                            onChange={this.handleChange}/>
                    </label>
                    <label>
                        Show Assigned:
                        <input
                            name="showAssigned"
                            type="checkbox"
                            checked={this.state.showAssigned}
                            onChange={this.handleChange}/>
                    </label>
                    <ToDoTable showAssigned={this.state.showAssigned} showFinished={this.state.showFinished}/>
                </div>
                <div>
                    Weekly Overview
                </div>
            </div>
        );
    }
}


// ========================================

ReactDOM.render(
    <Main/>,
    document.getElementById('root')
);