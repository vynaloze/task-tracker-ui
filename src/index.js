import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-table/react-table.css'
import ToDoTable from './ToDoTable'


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAssigned: false,
            showFinished: false,
            data: null,
            error: null,
            isLoaded: false
        };
        this.handleChange = this.handleChange.bind(this);
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
                        <ToDoTable showAssigned={this.state.showAssigned}
                                   showFinished={this.state.showFinished}
                                   data={this.state.data}
                        />
                    </div>
                    <div>
                        <div>
                            Weekly Overview
                        </div>
                        <div>

                        </div>
                    </div>
                </div>
            );
        }
    }
}


// ========================================

ReactDOM.render(
    <Main/>,
    document.getElementById('root')
);