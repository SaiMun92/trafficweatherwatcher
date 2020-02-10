import React, { useState } from 'react';
import {Dropdown} from "react-bootstrap";
import { NORTH, EAST, WEST, SOUTH} from "../constants/directions";
import PropTypes from 'prop-types';
import '../styles/RegionSelector.css'


export default function RegionSelector(props) {

    const [selectedRegion, setSelectedRegion] = useState(NORTH);
    const {rev_geocode} = props;

    const updater = (val) => {
        rev_geocode(val);
        setSelectedRegion(val);
    };

    return (
        <Dropdown className="region-dropdown">
            <Dropdown.Toggle variant="success" id="dropdown-basic" style={{ maxHeight: "50px"}}>
                Current Region: {selectedRegion}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item eventKey={NORTH} onSelect={val => updater(val)}>North</Dropdown.Item>
                <Dropdown.Item eventKey={SOUTH} onSelect={val => updater(val)}>South</Dropdown.Item>
                <Dropdown.Item eventKey={EAST} onSelect={val => updater(val)}>East</Dropdown.Item>
                <Dropdown.Item eventKey={WEST} onSelect={val => updater(val)}>West</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

RegionSelector.propTypes = {
    rev_geocode: PropTypes.func.isRequired,
};