import api from '@/lib/api';
import { RealEstate, CreateRealEstateInput, UpdateRealEstateInput } from '@/types/realEstate';

export const realEstateService = {
    getAll: async () => {
        const response = await api.get<RealEstate[]>('/real-estate');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<RealEstate>(`/real-estate/${id}`);
        return response.data;
    },

    create: async (data: CreateRealEstateInput) => {
        const response = await api.post<RealEstate>('/real-estate', data);
        return response.data;
    },

    update: async (id: string, data: UpdateRealEstateInput) => {
        const response = await api.put<RealEstate>(`/real-estate/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<{ message: string }>(`/real-estate/${id}`);
        return response.data;
    }
};
