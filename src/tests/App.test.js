import React from 'react';
import { shallow } from 'enzyme';
import "./setupTests";

import App from '../App';
import axios from 'axios';
import { TokenValidator } from "../components/utils/TokenValidator";

jest.mock('axios');

describe('App component', () => {
  it('fetches the token for rev geomatching', async () => {
    await expect(TokenValidator).resolves;
  });

  it('fetches traffic and weather data', async () => {
    const AppWrapper = shallow(<App />);
    let test_date = new Date();
    test_date.setDate(test_date.getDate()-5);
    AppWrapper.setState({current_date: test_date});
    await expect(AppWrapper.instance().fetch_traffic_and_weather_data()).resolves;
  });


});