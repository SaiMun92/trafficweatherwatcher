import React, {useEffect, useState} from 'react';
import { DropdownButton, Dropdown, SplitButton } from "react-bootstrap";
import CustomMenu from "./custom/CustomMenu";
import '../styles/LocationList.css';

export default function LocationList(props) {

    const updateIndex = (index) => {
        props.update(index);
    };
    const updateRoad = e => {
      e.preventDefault();
      props.update_road(e.target.value);
    };

    let dict = {};

    return (
        <div className="dropdown-roads">
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic" style={{ maxHeight: "50px"}}>
                    List of locations
                </Dropdown.Toggle>

                <Dropdown.Menu as={CustomMenu}>
                    {props.data.map((dataset, index) => {
                        // TODO: Error handler
                        let road = dataset.data["GeocodeInfo"][0]['ROAD'];
                        // Check if the Road exists
                        if (road in dict) {
                            dict[road] = dict[road] + 1;
                        }
                        else {
                            dict[road] = 1;
                        }

                        if (dict[road] > 1) {
                            road = road + "_" + dict[road];
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