// src/hooks/useQueries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  // User APIs
  createUser,
  getUser,
  updateUser,
  deleteUser,
  // Menu APIs
  createMenu,
  getMenu,
  updateMenu,
  deleteMenu,
  // Order APIs
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder,
  // Review APIs
  createReview,
  getReview,
  updateReview,
  deleteReview,
  login
} from './apiServices.ts';

import {
  UserCategory,
  createUserType,
  getUserType,
  updateUserType,
  loginType,
  createMenuType,
  getMenuType,
  updateMenuType,
  createOrderType,
  getOrderType,
  updateOrderType,
  createReviewType,
  getReviewType,
  updateReviewType,
} from '../DataModels/types.ts';

// ============= USER QUERIES =============
export const useGetUser = (userId: string) => {
  return useQuery<getUserType, Error>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await getUser(userId);
      return response.data;
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<getUserType, Error, createUserType>({
    mutationFn: async (userData: createUserType) => {
      const response = await createUser(userData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<getUserType, Error, updateUserType>({
    mutationFn: async (updateData: updateUserType) => {
      const response = await updateUser(userId, updateData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: async (userId: string) => {
      await deleteUser(userId);
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.removeQueries({ queryKey: ['user', userId] });
    },
  });
};

// ============= MENU QUERIES =============
export const useGetMenu = (menuId: string) => {
  return useQuery<getMenuType, Error>({
    queryKey: ['menu', menuId],
    queryFn: async () => {
      const response = await getMenu(menuId);
      return response.data;
    },
  });
};

export const useCreateMenu = () => {
  const queryClient = useQueryClient();
  
  return useMutation<getMenuType, Error, createMenuType>({
    mutationFn: async (menuData: createMenuType) => {
      const response = await createMenu(menuData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
};

export const useUpdateMenu = (menuId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<getMenuType, Error, updateMenuType>({
    mutationFn: async (updateData: updateMenuType) => {
      const response = await updateMenu(menuId, updateData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['menu', menuId] });
    },
  });
};

export const useDeleteMenu = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: async (menuId: string) => {
      await deleteMenu(menuId);
    },
    onSuccess: (_, menuId) => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
      queryClient.removeQueries({ queryKey: ['menu', menuId] });
    },
  });
};

// ============= ORDER QUERIES =============
export const useGetOrder = (orderId: string) => {
  return useQuery<getOrderType, Error>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await getOrder(orderId);
      return response.data;
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation<getOrderType, Error, createOrderType>({
    mutationFn: async (orderData: createOrderType) => {
      const response = await createOrder(orderData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      // Also invalidate menu queries as order might affect menu item quantities
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
};

export const useUpdateOrder = (orderId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<getOrderType, Error, updateOrderType>({
    mutationFn: async (updateData: updateOrderType) => {
      const response = await updateOrder(orderId, updateData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      // Also invalidate menu queries as order update might affect menu item quantities
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: async (orderId: string) => {
      await deleteOrder(orderId);
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.removeQueries({ queryKey: ['order', orderId] });
      // Also invalidate menu queries as order deletion might affect menu item quantities
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
};

// ============= REVIEW QUERIES =============
export const useGetReview = (reviewId: string) => {
  return useQuery<getReviewType, Error>({
    queryKey: ['review', reviewId],
    queryFn: () => getReview(reviewId),
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation<getReviewType, Error, createReviewType>({
    mutationFn: async (reviewData: createReviewType) => {
      const response = await createReview(reviewData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

export const useUpdateReview = (reviewId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<getReviewType, Error, updateReviewType>({
    mutationFn: async (updateData: updateReviewType) => {
      const response = await updateReview(reviewId, updateData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['review', reviewId] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: async (reviewId: string) => {
      await deleteReview(reviewId);
    },
    onSuccess: (_, reviewId) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.removeQueries({ queryKey: ['review', reviewId] });
    },
  });
};

// ============= LOGIN QUERY =============
export const useLogin = () => {
    return useMutation<getUserType, Error, loginType>({
        mutationFn: async (loginData: loginType) => {
            const response = await login(loginData);
            return response.data;
        },
    });
};