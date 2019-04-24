import React from 'react';
import ReactModal from "react-modal";
import DatePicker from 'react-datepicker';

export default class ToDoTableLogTime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stateSelect: true,
            stateWaiting: false,
            stateSuccess: false,
            stateError: false,
            error: null,
            startDate: null,
            endDate: null
        };

        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleStartDateChange(date) {
        this.setState({
            startDate: date
        })
    }

    handleEndDateChange(date) {
        this.setState({
            endDate: date
        })
    }

    handleSubmit() {
        let url = "http://localhost:3000/api/ToDos/" + this.props.todoId + "/WorkingTime/" + this.state.startDate.getTime()/1000 + '/' + this.state.endDate.getTime()/1000;
        fetch(url, {
            method: 'PATCH'
        }).then(
                async (result) => {
                    if (result.ok) {
                        this.setState({
                            stateSelect: false,
                            stateWaiting: false,
                            stateSuccess: true,
                            stateError: false
                        });
                    } else {
                        const err = await result.text();
                        this.setState({
                            stateSelect: false,
                            stateWaiting: false,
                            stateSuccess: false,
                            stateError: true,
                            error: err
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

    handleClose(){
        this.setState({
            stateSelect: true,
            stateWaiting: false,
            stateSuccess: false,
            stateError: false,
            error: null,
            startDate: null,
            endDate: null
        });
        this.props.onClose();
    }

    render() {
        return <ReactModal
            isOpen={this.props.show}
            onRequestClose={this.props.onClose}
            appElement={document.getElementById('root')}
            style={{overlay: {zIndex: 1000}}}
        >
            <h2>Log Time</h2>
            {this.state.stateSelect ?
                <div>
                    Start Work
                    <DatePicker
                        selected={this.state.startDate}
                        onChange={this.handleStartDateChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        timeCaption="Start Work"
                    />
                    End Work
                    <DatePicker
                        selected={this.state.endDate}
                        onChange={this.handleEndDateChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        timeCaption="End Work"
                    />
                    <button onClick={this.handleSubmit}>Log Time</button>
                </div>
                : null}
            {this.state.stateWaiting ? "Please wait..." : null}
            {this.state.stateSuccess ? <div> Successfully logged time.
                <button onClick={this.handleClose}>OK</button>
            </div> : null}
            {this.state.stateError ? <div> Task failed successfully: {this.state.error}
                <button onClick={this.handleClose}>OK</button>
            </div> : null}
        </ReactModal>
    }
}