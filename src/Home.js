import React from 'react';
import './index.css';
import 'react-table/react-table.css'
import ToDoTable from './ToDoTable'
import WeeklyOverview from "./WeeklyOverview";
import Menu from "./Menu"
import Auth from "./Auth";

//todo
// 9. administration page?
// 10. reports per user (working time, overtime, holidays,…) and project

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAssigned: false,
            showFinished: false,
            showOnlyMine: true,
            data: null,
            error: null,
            isLoaded: false
        };
    }

    componentDidMount() {
        this.loadToDos();
    }

    loadToDos() {
        fetch("http://localhost:3000/api/ToDos", {headers: {'Authorization': Auth.getAuthHeader()}})
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        data: result
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


    onDisplayOptionsChange(name, value) {
        this.setState({
            [name]: value
        })
    }

    render() {
        if (this.state.error) {
            return <div>Error: {this.state.error.message}</div>;
        } else if (!this.state.isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    <Menu
                        reloadParentData={() => this.loadToDos()}
                        onDisplayOptionsChange={(name, value) => this.onDisplayOptionsChange(name, value)}
                    />
                    <ToDoTable showAssigned={this.state.showAssigned}
                               showFinished={this.state.showFinished}
                               showOnlyMine={this.state.showOnlyMine}
                               data={this.state.data}
                               reloadParentData={() => this.loadToDos()}
                    />
                    <WeeklyOverview data={this.state.data}/>
                </div>
            );
        }
    }
}