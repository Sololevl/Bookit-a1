import axios from 'axios';
import { Experience, BookingRequest } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const experienceApi = {
  getAll: async (search?: string) => {
    const params = search ? { search } : {};
    const response = await api.get<{ success: boolean; data: Experience[] }>('/experiences', { params });
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: Experience }>(`/experiences/${id}`);
    return response.data.data;
  },
};

export const bookingApi = {
  create: async (bookingData: BookingRequest) => {
    const response = await api.post<{ success: boolean; data: { refId: string; message: string } }>('/bookings', bookingData);
    return response.data;
  },
};

export const promoApi = {
  validate: async (code: string) => {
    const response = await api.post<{ success: boolean; data?: any; message?: string }>('/promo/validate', { code });
    return response.data;
  },
};

export default api;