import axios from "axios";
import { PRODUKCIJA } from "../constants";

// environment varijablu za produkciju
const baseURL = import.meta.env.PROD ? '/api/v1' : PRODUKCIJA;

export const HttpService = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
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

// U produkciji ne prikazujemo logove
if (import.meta.env.DEV) {
    HttpService.interceptors.request.use(request => {
        console.log('Starting Request', request); 
        return request;
    });

    HttpService.interceptors.response.use(response => {
        console.log('Response:', response); 
        return response;
    });
}
