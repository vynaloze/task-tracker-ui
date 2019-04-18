import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Project(props) {
    return (
        <div>{props.value.name}</div>
    );
}

class Projects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }

    componentDidMount() {
        fetch("http://localhost:3000/api/Projects")
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
        // const items = [
        //     {
        //         "name": "string",
        //         "id": 1
        //     },
        //     {
        //         "name": "222",
        //         "id": 2
        //     }
        // ];

        const {error, isLoaded, items} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            const projects = items.map((p) => (
                <div>
                    <Project value={p}/>
                </div>
            ));
            return (
                <div className='projects'>
                    {projects}
                </div>

            )
        }
    }
}


class Main extends React.Component {
    render() {
        return (
            <Projects/>
        );
    }
}


// ========================================

ReactDOM.render(
    <Main/>,
    document.getElementById('root')
);