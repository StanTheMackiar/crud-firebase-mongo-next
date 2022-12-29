import axios from "axios";

export const controller = new AbortController();

const entriesApi = axios.create({
    baseURL: '/api',
    signal: controller.signal
})


export default entriesApi;