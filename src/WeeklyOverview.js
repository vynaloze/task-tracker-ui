import React from 'react';
import moment from 'moment';
import WeekCalendar from 'react-week-calendar';
import DatePicker from 'react-datepicker';
import 'react-week-calendar/dist/style.css';
import "react-datepicker/dist/react-datepicker.css";

// todo
// 2. datepicker to select first day
// 3. onSelect display sth


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

    handleEventRemove = (event) => {
        const {selectedIntervals} = this.state;
        const index = selectedIntervals.findIndex((interval) => interval.uid === event.uid);
        if (index > -1) {
            selectedIntervals.splice(index, 1);
            this.setState({selectedIntervals});
        }

    };

    handleEventUpdate = (event) => {
        const {selectedIntervals} = this.state;
        const index = selectedIntervals.findIndex((interval) => interval.uid === event.uid);
        if (index > -1) {
            selectedIntervals[index] = event;
            this.setState({selectedIntervals});
        }
    };

    handleSelect = (newIntervals) => {
        const {lastUid, selectedIntervals} = this.state;
        const intervals = newIntervals.map((interval, index) => {

            return {
                ...interval,
                uid: lastUid + index
            }
        });

        this.setState({
            selectedIntervals: selectedIntervals.concat(intervals),
            lastUid: lastUid + newIntervals.length
        })
    };

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
                onIntervalSelect={this.handleSelect}
                onIntervalUpdate={this.handleEventUpdate}
                onIntervalRemove={this.handleEventRemove}
            />
        </div>
    }
}