import React from 'react';
import { DropdownButton, Dropdown, SplitButton } from "react-bootstrap";
import CustomMenu from "./custom/CustomMenu";
import PropTypes from 'prop-types';
import '../styles/LocationList.css';

export default function LocationList(props) {

    let dict = {};
    const { location_data } = props;
    const {set_current_traffic_data} = props;
    const {set_current_road} = props;

    const updateIndex = (index) => {
        set_current_traffic_data(index);
    };
    const updateRoad = e => {
      e.preventDefault();
      set_current_road(e.target.value);
    };

    return (
        <div className="dropdown-roads">
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic" style={{ maxHeight: "50px"}}>
                    List of locations
                </Dropdown.Toggle>

                <Dropdown.Menu as={CustomMenu}>
                    {location_data.map((dataset, index) => {
                        let road = 'Unable to pinpoint location';
                        if (dataset.data["GeocodeInfo"].length > 0) {
                            road = dataset.data["GeocodeInfo"][0]['ROAD'];
                            // Check if the Road exists, if exists append number
                            if (road in dict) { dict[road] = dict[road] + 1;}
                            else { dict[road] = 1; }
                            if (dict[road] > 1) { road = road + "_" + dict[road];}
                        }
                        return (
                          <Dropdown.Item
                              as="button"
                              value={road}
                              eventKey={index}
                              key={index}
                              onSelect={index => updateIndex(index)}
                              onClick={e => updateRoad(e)}
                          >{road}
                          </Dropdown.Item>
                        );
                    })}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

LocationList.propTypes = {
    location_data: PropTypes.array.isRequired,
    set_current_traffic_data: PropTypes.func.isRequired,
    set_current_road: PropTypes.func.isRequired,
};