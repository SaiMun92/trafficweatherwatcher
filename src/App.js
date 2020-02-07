import React, { useState, Component } from 'react';
import { Container, Row } from 'react-bootstrap';
import DateTime from "./components/DateTime";
import LocationList from "./components/LocationList";
import RegionSelector from "./components/RegionSelector";
import axios from 'axios';
import { API_ADDRESSES } from "./constants/api_addresses";
import { NORTH_REGION, SOUTH_REGION, EAST_REGION, WEST_REGION } from "./constants/SingaporeRegion";
import { NORTH, SOUTH, EAST, WEST } from "./constants/directions";
import classifyPoint from 'robust-point-in-polygon';
import './styles/App.css';
import {TOKEN} from "./constants/token";



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageData : [],
      North_Region: [],
      South_Region: [],
      East_Region: [],
      West_Region: [],
      Current_Region: NORTH,
      forward_location_data : [],
      current_image: null,
      current_road: '',
    };
  }

  fetchTrafficImages = async (selectedDate) => {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let localISOTime = (new Date(selectedDate - tzoffset)).toISOString().split('.')[0];

    try {
      const { data } = await axios.get(API_ADDRESSES['traffic_images'], {
        params: {
          'date_time': localISOTime,
        }
      });
      this.setState({
        imageData: data['items'][0]['cameras'],
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

    let data_val = this.state.imageData;
    for (let i=0; i < data_val.length; i++) {
      let point = [data_val[i].location.latitude, data_val[i].location.longitude];

      if (classifyPoint(NORTH_REGION, point) !== 1) {
        north.push(data_val[i]);
        continue;
      }
      if (classifyPoint(SOUTH_REGION, point) !== 1) {
        south.push(data_val[i]);
        continue;
      }
      if (classifyPoint(EAST_REGION, point) !== 1) {
        east.push(data_val[i]);
        continue;
      }
      if (classifyPoint(WEST_REGION, point) !== 1) {
        west.push(data_val[i]);
      }
    }
    this.setState({
      North_Region: north,
      South_Region: south,
      East_Region: east,
      West_Region: west,
    }, ()=> this.modify_image_data(NORTH));
  };

  create_batch_api = (data) => {
    return data.map((data_val, index) => {
      return axios.get(API_ADDRESSES['reverse_geocode'], {
        params: {
          location: `${data_val.location.latitude},${data_val.location.longitude}`,
          buffer: 50,
          token: TOKEN
        }
      })
    });
  };

  modify_image_data = async (region) => {
    let list_of_promises;
    if (region === NORTH) { list_of_promises = this.create_batch_api(this.state.North_Region); }
    else if (region === SOUTH) { list_of_promises = this.create_batch_api(this.state.South_Region); }
    else if (region === WEST) { list_of_promises = this.create_batch_api(this.state.West_Region); }
    else if (region === EAST) { list_of_promises = this.create_batch_api(this.state.East_Region); }

    const data  = await axios.all(list_of_promises);
    this.setState({
      forward_location_data: data,
      Current_Region: region,
    });
  };

  set_current_image = (index) => {
    let current_image;

    console.log("index: ", index);
    if (this.state.Current_Region === NORTH) { current_image = this.state.North_Region[index]['image'];}
    else if (this.state.Current_Region === SOUTH) { current_image = this.state.South_Region[index]['image'];}
    else if (this.state.Current_Region === EAST) { current_image = this.state.East_Region[index]['image'];}
    else if (this.state.Current_Region === WEST) { current_image = this.state.West_Region[index]['image'];}

    this.setState({
      current_image
    });
  };

  set_current_road = (current_road) => {
    this.setState({
      current_road
    });
  };

  render() {
    return (
        <div className="App">
          <Container>
            <DateTime update={this.fetchTrafficImages}/>
            <Row className="justify-content-md-center">
              <RegionSelector update={this.modify_image_data}/>
              <LocationList data={this.state.forward_location_data}
                            update={this.set_current_image}
                            update_road={this.set_current_road}/>
            </Row>
            <h5>{this.state.current_road}</h5>
            <Row>
              <img src={this.state.current_image} />
            </Row>
          </Container>
        </div>
    )
  }
}

export default App;
