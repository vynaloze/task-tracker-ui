import React from 'react';
import moment from 'moment';
import WeekCalendar from 'react-week-calendar';
import DatePicker from 'react-datepicker';
import 'react-week-calendar/dist/style.css';
import "react-datepicker/dist/react-datepicker.css";
import Auth from "./Auth"

export default class WeeklyOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstDay: moment().subtract(6, 'days').toDate()
        };

        this.handleFirstDayChange = this.handleFirstDayChange.bind(this);
    }

    handleFirstDayChange(day) {
        this.setState({
            firstDay: day
        })
    }

    render() {
        const filteredData = this.props.data
            .filter(d => d.user != null && d.user.id === Number(Auth.getUserId()))
            .filter(d => d.endTime != null);
        const parsedData = filteredData.map(d => {
            return {
                uid: d.id,
                start: moment(d.startTime),
                end: moment(d.endTime),
                value: d.name
            }
        });

        return <div style={{display: "flex"}}>
            <div>
                Select starting date:
                <DatePicker
                    inline
                    todayButton={"Today"}
                    selected={this.state.firstDay}
                    onChange={this.handleFirstDayChange}
                />
            </div>
            <WeekCalendar
                firstDay={moment(this.state.firstDay)}
                startTime={moment({h: 8, m: 0})}
                endTime={moment({h: 20, m: 0})}
                numberOfDays={7}
                scaleUnit={30}
                selectedIntervals={parsedData}
                useModal={false}
            />
        </div>
    }
}