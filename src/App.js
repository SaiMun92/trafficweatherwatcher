import  React, { Component } from 'react';
import {Button, Container, Row} from 'react-bootstrap';
import { Spinner } from "react-bootstrap";
import './styles/App.css';

import axios from 'axios';
import Cookies from 'js-cookie';
import { API_ADDRESSES } from "./constants/api_addresses";
import { NORTH_REGION, SOUTH_REGION, CENTRAL_REGION, EAST_REGION, WEST_REGION } from "./constants/SingaporeRegion";
import { NORTH } from "./constants/directions";

import _ from 'lodash';
import DateTime from "./components/DateTime";
import LocationList from "./components/LocationList";
import RegionSelector from "./components/RegionSelector";
import WeatherInfo from "./components/WeatherInfo";
import classifyPoint from 'robust-point-in-polygon';
import { FindNearestGeoPoint } from './components/utils/FindNearestGeoPoint';
import { TokenValidator } from "./components/utils/TokenValidator";
import { create_batch_api } from "./components/utils/CreateBatchAPI";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image_data : [],
      weather_data: [],
      Regions: {},
      location_data : [],
      current_region: NORTH,
      current_road: '',
      current_index: null,
      current_traffic_data: [],
      current_weather_data: {},
      current_date: '',
      loading_button: false,
      location_list_toggle: false,
    };
  }

  fetch_traffic_and_weather_data = async () => {
    this.setState({ loading_button: true });

    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let localISOTime = (new Date(this.state.current_date - tzoffset)).toISOString().split('.')[0];

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
        weather_data: weather_forecast_data.data,
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
    let central = [];

    let data_val = this.state.image_data;
    for (let i=0; i < data_val.length; i++) {
      let point = [data_val[i].location.latitude, data_val[i].location.longitude];

      if (classifyPoint(NORTH_REGION, point) !== 1) { north.push(data_val[i]); continue;}
      if (classifyPoint(SOUTH_REGION, point) !== 1) {south.push(data_val[i]);continue;}
      if (classifyPoint(CENTRAL_REGION, point) !== 1) { central.push(data_val[i]);continue;}
      if (classifyPoint(EAST_REGION, point) !== 1) {east.push(data_val[i]);continue;}
      if (classifyPoint(WEST_REGION, point) !== 1) {west.push(data_val[i]);}
    }

    this.setState({
      Regions: {
        NORTH: north,
        SOUTH: south,
        CENTRAL: central,
        EAST: east,
        WEST: west
      },
    }, ()=> this.rev_geocode(this.state.current_region));
  };

  rev_geocode = async (current_region) => {
    this.setState({ loading_button: true, location_list_toggle: true });
    const list_of_promises = create_batch_api(this.state.Regions[current_region]);
    const data  = await axios.all(list_of_promises);
    this.setState({
      location_data: data,
      current_region,
      loading_button: false,
      location_list_toggle: false,
    });
  };

  set_current_traffic_data = (index) => {
    let current_traffic_data = this.state.Regions[this.state.current_region][index];
    console.log(current_traffic_data['location']);
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

    let index = FindNearestGeoPoint({latitude, longitude}, this.state.weather_data);
    this.setState({
      current_weather_data: this.state.weather_data['items'][0]['forecasts'][index],
    });
  };

  set_current_date = (current_date) => {
    this.setState({ current_date });
  };

  componentDidMount() {
    const token_promise = TokenValidator();
    token_promise.then(data => {
      Cookies.set('token', data['access_token']);
    }).catch(err => {
      console.log(err);
    });

  }

  render() {
    return (
        <div className="App">
          <Container>
            <h1 className="center display-4">Traffic Weather Watcher</h1>
            <p className="center lead">This is a simple app that displays traffic images and weather forecast.</p>
            <hr className="my-4" />
            <Row className="center">
                <DateTime set_current_date={this.set_current_date}/>
                <div className="go-button-div">
                  {this.state.loading_button ? (
                      <Button variant="primary" disabled>
                        <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                        Loading...
                      </Button>
                  ): (<Button className="go-button"
                              variant="primary"
                              onClick={this.fetch_traffic_and_weather_data}>Go</Button>)}
                </div>

            </Row>

            {!_.isEmpty(this.state.location_data) ?
                (<div className="controls">
                  <div className="control">
                    <RegionSelector rev_geocode={this.rev_geocode}/>
                  </div>
                  <div className="break"></div>
                  <div className="control">
                    <LocationList location_data={this.state.location_data}
                                  set_current_traffic_data={this.set_current_traffic_data}
                                  set_current_road={this.set_current_road}
                                  location_list_toggle={this.state.location_list_toggle}
                    />
                  </div>
                </div>) : null
            }

            <br/>
            <h5>{this.state.current_road}</h5>
            {!_.isEmpty(this.state.current_traffic_data) && !_.isEmpty(this.state.current_weather_data) ?
                (<Row className="center">
                  <div id="img-container">
                    <img src={this.state.current_traffic_data['image']} alt=""/>
                  </div>
                  <WeatherInfo weather_data={this.state.current_weather_data}/>
                </Row>) : null
            }
          </Container>
        </div>
    )
  }
}

export default App;
