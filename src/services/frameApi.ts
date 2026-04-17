import axios from 'axios';

const API_URL = 'http://40.47.197.203:8000/api/frames';
export const STORAGE_URL = 'http://40.47.197.203:8000/storage/';

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
    }
};