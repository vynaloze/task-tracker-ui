import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ReactTable from "react-table";
import 'react-table/react-table.css'

class ToDoTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAssigned: props.showAssigned,
            showFinished: props.showFinished,
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
        const {error, isLoaded, items} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            const columns = [{
                Header: 'Task',
                accessor: 'name'
            }, {
                id: 'finished',
                Header: 'Finished',
                accessor: d => d.endTime != null ? 'yes' : 'no'
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
                },
            }
            ];
            return (
                <ReactTable
                    data={items}
                    columns={columns}
                />
            )
        }
    }
}


class Main extends React.Component {
    render() {
        return (
            <div>
                <ToDoTable showAssigned={true} showFinished={true}/>
            </div>

        );
    }
}


// ========================================

ReactDOM.render(
    <Main/>,
    document.getElementById('root')
);