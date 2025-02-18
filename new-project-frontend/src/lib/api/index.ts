import axios from 'axios';
import { API_URL } from '../../constants/api';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: API_URL, // Set your API base URL here
    timeout: 10000, // Timeout in milliseconds
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Add authorization token or any custom headers
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Handle successful response
        return response.data;
    },
    (error) => {
        // Handle errors (e.g., log out if token expired)
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized! Redirecting to login...');
            // Perform logout or redirect logic here
        }
        return Promise.reject(error.response || error.message);
    }
);



export type HTTP_METHODS = "POST" | "GET" | "PUT" | "DELETE" | "PATCH"

// Axios wrapper function
const apiRequest = async (method: HTTP_METHODS, url: string, data: Record<any, any> | null = null, options: Record<any, any> = {}, baseURL?: string): Promise<any> => {
    try {
        const response = await axiosInstance({
            method,
            url,
            data,
            ...options, // Allow custom options like headers, params, etc.,
            baseURL: baseURL ?? axiosInstance.defaults.baseURL
        });
        return response;
    } catch (error) {

        //TODO: Add Error Display handling
        console.error('API Error:', error);
        throw error; // Rethrow error for further handling
    }
};

export default apiRequest;
