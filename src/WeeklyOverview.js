import React from 'react';
import moment from 'moment';
import WeekCalendar from 'react-week-calendar';
import DatePicker from 'react-datepicker';
import 'react-week-calendar/dist/style.css';
import "react-datepicker/dist/react-datepicker.css";

export default class WeeklyOverview extends React.Component {
    constructor(props) {
        super(props);
        const filteredData = props.data
        //todo .filter(d => d.user == CURRENT_USER)
            .filter(d => d.endTime != null);
        const parsedData = filteredData.map(d => {
            return {
                uid: d.id,
                start: moment(d.startTime),
                end: moment(d.endTime),
                value: d.name
            }
        });
        this.state = {
            lastUid: 4,
            selectedIntervals: parsedData,
            firstDay: new Date()
        };

        this.handleFirstDayChange = this.handleFirstDayChange.bind(this);
    }

    handleFirstDayChange(day) {
        this.setState({
            firstDay: day
        })
    }

    render() {
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
                selectedIntervals={this.state.selectedIntervals}
                useModal={false}
            />
        </div>
    }
}