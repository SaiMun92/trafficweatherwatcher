import React from 'react';
import PropTypes from 'prop-types';


function WeatherInfo(props) {

    const { weather_data }  = props;

    return (
      <div>
          <h6>2 Hr Weather Forecast</h6>
          <h6>{`Area: ${weather_data['area']}`}</h6>
          <h6>{`Weather Conditions: ${weather_data['forecast']}`}</h6>
      </div>
    );
}

WeatherInfo.propTypes = {
    weather_data: PropTypes.object.isRequired,
};

export default WeatherInfo;