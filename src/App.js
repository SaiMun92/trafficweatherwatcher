import  React, { Component } from 'react';
import { Container, Row } from 'react-bootstrap';
import './styles/App.css';

import axios from 'axios';
import { API_ADDRESSES } from "./constants/api_addresses";
import { NORTH_REGION, SOUTH_REGION, EAST_REGION, WEST_REGION } from "./constants/SingaporeRegion";
import { NORTH, SOUTH, EAST, WEST } from "./constants/directions";
import { TOKEN } from "./constants/token";

import DateTime from "./components/DateTime";
import LocationList from "./components/LocationList";
import RegionSelector from "./components/RegionSelector";
import WeatherInfo from "./components/WeatherInfo";
import classifyPoint from 'robust-point-in-polygon';
import { FindNearestGeoPoint } from './components/utils/FindNearestGeoPoint';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image_data : [],
      weather_data: [],
      Regions: {},
      Current_Region: NORTH,
      location_data : [],
      current_road: '',
      current_index: null,
      current_traffic_data: [],
    };
  }

  fetch_traffic_and_weather_data = async (selectedDate) => {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let localISOTime = (new Date(selectedDate - tzoffset)).toISOString().split('.')[0];

    try {
      const traffic_images_data = await axios.get(API_ADDRESSES['traffic_images'], {
        params: {
          'date_time': localISOTime,
        }
      });

      const weather_forecast_data = await axios.get(API_ADDRESSES['weather_forecast'], {
        params: {
          'date_time': localISOTime,
        }
      });

      this.setState({
        image_data: traffic_images_data.data['items'][0]['cameras'],
        weather_data: weather_forecast_data.data
      }, () => this.classifying_points_to_regions());

    }
    catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }
  };

  classifying_points_to_regions = () => {
    // split the coordinates into north, south, east, west
    let north = [];
    let south = [];
    let east = [];
    let west = [];

    let data_val = this.state.image_data;
    for (let i=0; i < data_val.length; i++) {
      let point = [data_val[i].location.latitude, data_val[i].location.longitude];

      if (classifyPoint(NORTH_REGION, point) !== 1) { north.push(data_val[i]); continue;}
      if (classifyPoint(SOUTH_REGION, point) !== 1) {south.push(data_val[i]);continue;}
      if (classifyPoint(EAST_REGION, point) !== 1) {east.push(data_val[i]);continue;}
      if (classifyPoint(WEST_REGION, point) !== 1) {west.push(data_val[i]);}
    }

    this.setState({
      Regions: {
        NORTH: north,
        SOUTH: south,
        EAST: east,
        WEST: west
      },

    }, ()=> this.rev_geocode(NORTH));
  };

  create_batch_api = (data) => {
    return data.map((data_val) => {
      return axios.get(API_ADDRESSES['reverse_geocode'], {
        params: {
          location: `${data_val.location.latitude},${data_val.location.longitude}`,
          buffer: 50,
          token: TOKEN
        }
      })
    });
  };

  rev_geocode = async (current_region) => {
    const list_of_promises = this.create_batch_api(this.state.Regions[current_region]);
    const data  = await axios.all(list_of_promises);
    this.setState({
      location_data: data,
      Current_Region: current_region,
    });
  };

  set_current_data = (index) => {
    let current_traffic_data = this.state.Regions[this.state.Current_Region][index];
    this.setState({
      current_traffic_data,
      current_index: index,
    }, () => {
      this.set_current_weather_condition_and_approx_location();
    });
  };

  set_current_road = (current_road) => {
    this.setState({
      current_road
    });
  };

  // Return the closest location and the weather condition
  set_current_weather_condition_and_approx_location = () => {
    let latitude = this.state.current_traffic_data['location']['latitude'];
    let longitude = this.state.current_traffic_data['location']['longitude'];

    // TODO: display the lat long in the front end
    console.log(latitude, longitude);
    let index = FindNearestGeoPoint({latitude, longitude}, this.state.weather_data);
    console.log(index);
    console.log(this.state.weather_data['area_metadata'][index]);
  };


  render() {
    return (
        <div className="App">
          <Container>
            <DateTime update={this.fetch_traffic_and_weather_data}/>
            <Row className="justify-content-md-center">
              <RegionSelector update={this.rev_geocode}/>
              <LocationList data={this.state.location_data}
                            update={this.set_current_data}
                            update_road={this.set_current_road}/>
            </Row>
            <h5>{this.state.current_road}</h5>
            <Row>
              {/*TODO: Adjust Image Size*/}
              <img src={this.state.current_traffic_data['image']}/>
              <WeatherInfo />
            </Row>
          </Container>
        </div>
    )
  }
}

export default App;
