import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Project(props) {
    return (
        <div>{props.value.name}</div>
    );
}

class Projects extends React.Component {
    render() {
        const projectsJson = [
            {
                "name": "string",
                "id": 1
            },
            {
                "name": "222",
                "id": 2
            }
        ];

        const projects = projectsJson.map((p) => (
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