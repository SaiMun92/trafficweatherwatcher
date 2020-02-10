import React, { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { setHours, setMinutes, subDays } from "date-fns";
import PropTypes from 'prop-types';


export default function DateTime(props) {
    const [selectedDate, setSelectedDate] = useState(null);
    const { fetch_traffic_and_weather_data } = props;

    const liftDataUp = () => {
        console.log(selectedDate);
        fetch_traffic_and_weather_data(selectedDate);
    };


    return(
      <Row className="justify-content-md-center">

          <Col>
              Date:
              <DatePicker
                  selected={selectedDate}
                  onChange={date => setSelectedDate(date)}
                  showTimeSelect
                  showYearDropdown
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  placeholderText="Select a date and time"
                  maxDate={subDays(new Date(), 1)}
                  minTime={setHours(setMinutes(new Date(), 0), 0)}
                  maxTime={setHours(setMinutes(new Date(), 45), 23)}
              />
              <Button variant="primary" onClick={liftDataUp}>Go</Button>
          </Col>
      </Row>
    );
}

DateTime.propTypes = {
    fetch_traffic_and_weather_data: PropTypes.func.isRequired,
};