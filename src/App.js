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
    <List of locations /> - reverse geo location using external api

    <Weather /> - need a function to return the nearest location based on the selected location
    <Screenshot />
   */

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [imageData, setImageData] = useState([]);
  const [weatherData, setWeatherData] = useState([]);


  const fetchTrafficImages = async (selectedDate) => {
    try {
      const { data } = await axios.get(API_ADDRESSES['traffic_images'], {
        params: {
          'date_time': selectedDate.toISOString().split('.')[0],
        }
      });

      console.log(data['items'][0]['cameras'].length);
      setImageData(data['items'][0]['cameras']);
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
