import axios from "axios";

// environment varijablu za produkciju
const baseURL = import.meta.env.VITE_PRODUKCIJA;

export const HttpService = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

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
