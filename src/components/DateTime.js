import React, { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import DatePicker from "react-datepicker";


export default function DateTime(props) {

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const liftDataUp = () => {
        console.log(selectedDate);
        console.log(selectedTime);
        props.update(selectedDate, selectedTime);
    };


    return(
      <Row className="justify-content-md-center">

          {/*Can i combine this?*/}
          <Col>
              Date:
              <DatePicker
                showPopperArrow={false}
                dateFormat="dd/MM/yyyy"
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                placeholderText="Select a date"
                maxDate={new Date()}
              />
          </Col>
          <Col>
              Time:
              <DatePicker
                  selected={selectedTime}
                  onChange={time => setSelectedTime(time)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  placeholderText="Select a time"
              />
          </Col>
          <Col>
              <Button
                  variant="primary"
                  onClick={liftDataUp}
              >Go</Button>
          </Col>
      </Row>
    );
}