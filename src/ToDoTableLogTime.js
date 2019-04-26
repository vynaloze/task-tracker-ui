import React from 'react';
import ReactModal from "react-modal";
import DatePicker from 'react-datepicker';
import styles from './modal.css.js'
import Auth from "./Auth";

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
        let url = "http://localhost:3000/api/ToDos/" + this.props.todoId
            + "/WorkingTime/" + (this.state.startDate.getTime() / 1000).toFixed(0)
            + '/' + (this.state.endDate.getTime() / 1000).toFixed(0);
        fetch(url, {
            method: 'PATCH',
            headers: {'Authorization': Auth.getAuthHeader()}
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

    handleClose() {
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
            style={styles.modalLong}
        >
            <h2>Log Time</h2>
            <div className="container-fluid">
                {this.state.stateSelect ?
                    <div className="row">
                        <div className="col-1">
                            Start
                        </div>
                        <div className="col-4">
                            <DatePicker
                                selected={this.state.startDate}
                                onChange={this.handleStartDateChange}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                timeCaption="Start Work"
                            />
                        </div>
                        <div className="col-1">
                            End
                        </div>
                        <div className="col-4">
                            <DatePicker
                                selected={this.state.endDate}
                                onChange={this.handleEndDateChange}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                timeCaption="End Work"
                            />
                        </div>
                        <div className="col-2">
                            {this.state.startDate != null && this.state.endDate != null ?
                                <button className="btn btn-dark btn-sm" onClick={this.handleSubmit}>Log Time</button>
                                : null}
                        </div>
                    </div>
                    : null}
                {this.state.stateWaiting ? "Please wait..." : null}
                {this.state.stateSuccess ? <div> Successfully logged time.
                    <button className="btn btn-dark btn-sm" onClick={this.handleClose}>OK</button>
                </div> : null}
                {this.state.stateError ? <div> Task failed successfully: {this.state.error}
                    <button className="btn btn-dark btn-sm" onClick={this.handleClose}>OK</button>
                </div> : null}
            </div>
        </ReactModal>
    }
}