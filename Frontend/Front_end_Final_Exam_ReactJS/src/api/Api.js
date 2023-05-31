import axios from 'axios';
import Storage from '../Storage/Storage';

const axiosClient = axios.create({
    baseURL: `http://localhost:8080/api/v1`,
    //timeout: 5000, // default is `0` (no timeout)
    // responseType: 'json'
});

axiosClient.interceptors.request.use(async (config) => {
    // Handle token here ...
    // attach token to header if exists
    const token = Storage.getToken();
    if (token !== null && token !== undefined) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

axiosClient.interceptors.response.use((response) => {
    if (response && response.data !== undefined) {
        // only get data
        return response.data;
    }

    return response;
}, (error) => {

    if (error.response) {
        throw error.response;
    }

    if (error.request) {
        throw error.request;
    }

    // Handle errors
    throw error;
});

export default axiosClient;