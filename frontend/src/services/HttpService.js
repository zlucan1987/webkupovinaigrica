import axios from "axios";
import { PRODUKCIJA } from "../constants";
import logger from "../utils/logger";

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
        return logger.httpResponse(response);
    },
    error => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        return logger.httpError(error);
    }
);

// Log requests with environment-specific sanitization
HttpService.interceptors.request.use(request => {
    return logger.httpRequest(request);
});
