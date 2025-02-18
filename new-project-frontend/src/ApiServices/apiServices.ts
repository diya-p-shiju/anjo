import axios from 'axios';
import { createUserType, getUserType, updateUserType, createMenuType, getMenuType, updateMenuType, createOrderType, getOrderType, updateOrderType, createReviewType, getReviewType, updateReviewType } from '../DataModels/types';

export const API_URL = 'http://localhost:3000';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
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
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized. Redirecting to login...');
        }
        return Promise.reject(error.response || error.message);
    }
);

export default axiosInstance;

// Root API
export const getRoot = async () => {
    return axiosInstance.get('/');
};

// Order APIs
export const createOrder = async (orderData: createOrderType) => {
    return axiosInstance.post('/order', orderData);
};

export const getOrder = async (orderId: string) => {
    return axiosInstance.get<getOrderType>(`/order/${orderId}`);
};

export const updateOrder = async (orderId: string, updateData: updateOrderType) => {
    return axiosInstance.put(`/order/${orderId}`, updateData);
};

export const deleteOrder = async (orderId: string) => {
    return axiosInstance.delete(`/order/${orderId}`);
};

// Menu APIs
export const createMenu = async (menuData: createMenuType) => {
    return axiosInstance.post('/menu', menuData);
};

export const getMenu = async (menuId: string) => {
    return axiosInstance.get<getMenuType>(`/menu/${menuId}`);
};

export const updateMenu = async (menuId: string, updateData: updateMenuType) => {
    return axiosInstance.put(`/menu/${menuId}`, updateData);
};

export const deleteMenu = async (menuId: string) => {
    return axiosInstance.delete(`/menu/${menuId}`);
};

// User APIs
export const createUser = async (userData: createUserType) => {
    return axiosInstance.post('/user', userData);
};

export const getUser = async (userId: string) => {
    return axiosInstance.get<getUserType>(`/user/${userId}`);
};

export const updateUser = async (userId: string, updateData: updateUserType) => {
    return axiosInstance.put(`/user/${userId}`, updateData);
};

export const deleteUser = async (userId: string) => {
    return axiosInstance.delete(`/user/${userId}`);
};

// Review APIs
export const createReview = async (reviewData: createReviewType) => {
    return axiosInstance.post('/review', reviewData);
};

export const getReview = async (reviewId: string) => {
    return axiosInstance.get<getReviewType>(`/review/${reviewId}`);
};

export const updateReview = async (reviewId: string, updateData: updateReviewType) => {
    return axiosInstance.put(`/review/${reviewId}`, updateData);
};

export const deleteReview = async (reviewId: string) => {
    return axiosInstance.delete(`/review/${reviewId}`);
};

// Auth APIs
export const login = async (username : string, password) => {
    try {
        const response = await axiosInstance.post('/auth/login', { username, password });
        const { token } = response.data;
        localStorage.setItem('authToken', token);
        return response;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};