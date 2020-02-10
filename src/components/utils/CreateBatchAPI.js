import axios from "axios";
import {API_ADDRESSES} from "../../constants/api_addresses";
import Cookies from "js-cookie";

export const create_batch_api = (data) => {
    return data.map((data_val) => {
        return axios.get(API_ADDRESSES['reverse_geocode'], {
            params: {
                location: `${data_val.location.latitude},${data_val.location.longitude}`,
                buffer: 50,
                token: Cookies.get('token'),
            }
        })
    });
};