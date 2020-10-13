import axios from 'axios';
import qs from 'qs';
import { API_ADDRESSES } from "../../constants/api_addresses";

const email = process.env.REACT_APP_ONEMAP_EMAIL;
const pwd = process.env.REACT_APP_ONEMAP_PWD;

export async function TokenValidator() {

    const body = {
        email: email,
        password: pwd
    }

    try {
        const { data } = await axios({
            method: 'post',
            url: API_ADDRESSES['get_token'],
            data: qs.stringify(body),
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return data;
    }
    catch (error) {
        if (error.response) {
            console.log(error.response);
        }
    }
}