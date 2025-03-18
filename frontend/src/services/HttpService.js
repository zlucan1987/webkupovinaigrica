import axios from "axios";
import { PRODUKCIJA } from "../constants";

// environment varijablu za produkciju
// Always use the absolute URL to avoid potential routing issues
const baseURL = PRODUKCIJA;

export const HttpService = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization, X-Request-With'
    },
    withCredentials: false
});

// Check if we have a token in localStorage and add it to headers
const token = localStorage.getItem('jwtToken');
if (token) {
    HttpService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add a request interceptor to dynamically add the token to each request
HttpService.interceptors.request.use(
    config => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
HttpService.interceptors.response.use(
    response => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        console.log('Response:', response);
        return response;
    },
    error => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        console.error('HTTP Error:', error);
        console.error('Error details:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                data: error.config?.data,
                baseURL: error.config?.baseURL,
                headers: error.config?.headers
            }
        });
        return Promise.reject(error);
    }
);

// Always log requests in both DEV and PROD for debugging
HttpService.interceptors.request.use(request => {
    console.log('Starting Request', {
        url: request.url,
        method: request.method,
        data: request.data,
        baseURL: request.baseURL,
        headers: request.headers
    });
    return request;
});
