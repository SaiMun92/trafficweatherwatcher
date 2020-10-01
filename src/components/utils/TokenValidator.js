import axios from 'axios';
import { API_ADDRESSES } from "../../constants/api_addresses";

const email = process.env.REACT_APP_ONEMAP_EMAIL;
const pwd = process.env.REACT_APP_ONEMAP_PWD;

export async function TokenValidator() {
    let bodyFormData = new FormData();

    bodyFormData.set('email', email);
    bodyFormData.set('password', pwd);

    try {
        const { data } = await axios({
            method: 'post',
            url: API_ADDRESSES['get_token'],
            data: bodyFormData,
            headers: {'Content-Type': 'multipart/form-data' }
        });
        return data;
    }
    catch (error) {
        if (error.response) {
            console.log(error.response);
        }
    }
}