import axios from "axios";


export const uploadImageApi = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'multipart/form-data',
    }
})