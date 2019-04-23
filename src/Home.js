import React from 'react';
import './index.css';
import 'react-table/react-table.css'
import ToDoTable from './ToDoTable'
import WeeklyOverview from "./WeeklyOverview";
import Menu from "./Menu"

//todo
// 5. log time
// 6. assign to project
// 7. reset password

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
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.loadToDos();
    }

    loadToDos() {
        fetch("http://localhost:3000/api/ToDos")
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

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.checked
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
                    <Menu reloadParentData={() => this.loadToDos()}/>
                    <div>
                        <div>
                            General Overview
                        </div>
                        <label>
                            Show Only Mine:
                            <input
                                name="showOnlyMine"
                                type="checkbox"
                                checked={this.state.showOnlyMine}
                                onChange={this.handleChange}/>
                        </label>
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
                        <ToDoTable showAssigned={this.state.showAssigned}
                                   showFinished={this.state.showFinished}
                                   showOnlyMine={this.state.showOnlyMine}
                                   data={this.state.data}
                                   reloadParentData={() => this.loadToDos()}
                        />
                    </div>
                    <div>
                        <div>
                            Your Weekly Overview
                        </div>
                        <WeeklyOverview data={this.state.data}/>
                    </div>
                </div>
            );
        }
    }
}