import axios from 'axios';

export const API_URL = 'http://localhost:3000';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout:1000,
    headers:{
        'Content-Type' : 'application/json',
        Accept: 'application/json'
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if(token) {
            config.headers['Authorization'] =`Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) =>{
        if(error.response && error.response.token === 401){
            console.error('Unathuorized Redirecting ti login...');
        }
        return Promise.reject(error.response || error.message);
    }
)