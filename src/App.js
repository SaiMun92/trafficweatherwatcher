import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import DateTime from "./components/DateTime";
import axios from 'axios';
import { API_ADDRESSES } from "./constants/api_addresses";
import './styles/App.css';



function App() {

  /*
    overall state
      - date
      - time

    <Heading />
    <Datetime />
    <List of locations />

    <Weather /> - need a function to return the nearest location
    <Screenshot />
   */

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [imageData, setImageData] = useState([]);
  const [weatherData, setWeatherData] = useState([]);


  const fetchTrafficImages = async (selectedDate, selectedTime) => {
    let proper_date;
    // convert the date into a proper format
    // toISOString();

    try {
      const { data } = await axios.get(API_ADDRESSES['traffic_images'], {
        params: {
          'date_time': proper_date,
        }
      });

      // update the state
    }
    catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }

  };

  return (
    <div className="App">
      <Container>
        <DateTime update={fetchTrafficImages}/>
      </Container>
    </div>
  );
}

export default App;
