import React from "react";
import ReactTable from "react-table";

export default class ToDoTable extends React.Component {
    render() {
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

        let data = this.props.data;

        if (this.props.showFinished) {
            columns = columns.concat([])
        } else {
            data = data.filter(i => i.endTime == null);
        }

        if (!this.props.showAssigned) {
            data = data.filter(i => i.user == null);
        }

        return (
            <ReactTable
                className={"-striped -highlight"}
                defaultPageSize={5}
                data={data}
                columns={columns}
            />
        )
    }
}