import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import { setHours, setMinutes, subDays } from "date-fns";
import PropTypes from 'prop-types';
import '../styles/DateTime.css';


export default function DateTime(props) {
    const [selectedDate, setSelectedDate] = useState(null);
    const { set_current_date } = props;

    const liftDataUp = (date) => {
        console.log(selectedDate);
        setSelectedDate(date);
        set_current_date(date);
    };


    return(
      <div className="datetime-parent">
          <div className="textLabel">Date:</div>
          <DatePicker
              selected={selectedDate}
              onChange={date => liftDataUp(date)}
              showTimeSelect
              showYearDropdown
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select a date and time"
              popperModifiers={{
                  preventOverflow: {
                      enabled: true,
                  },
              }}
              maxDate={subDays(new Date(), 1)}
              minTime={setHours(setMinutes(new Date(), 0), 0)}
              maxTime={setHours(setMinutes(new Date(), 45), 23)}
          />
      </div>
    );
}

DateTime.propTypes = {
    set_current_date: PropTypes.func.isRequired,
};