import axios from 'axios';

const API_URL = 'http://192.168.0.94:8000/api/frames';
export const STORAGE_URL = 'http://192.168.0.94:8000/storage/';

export const frameApi = {
    getAll: async() => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    create: async (formData: FormData) => {
        const response = await axios.post(API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    update: async(id:number | string, formData: FormData) => {
        formData.append('_method', 'PUT');
        const response = await axios.post(`${API_URL}/${id}`, formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        });
        return response.data;
    },

    delete: async(id: number | string) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    }
};