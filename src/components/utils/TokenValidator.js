import axios from 'axios';
import { API_ADDRESSES } from "../../constants/api_addresses";

export async function TokenValidator() {
    let bodyFormData = new FormData();

    bodyFormData.set('email', 'saimun92@icloud.com');
    bodyFormData.set('password', 'password123');

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