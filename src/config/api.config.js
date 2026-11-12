import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://campaing-hub.vercel.app/v1'
});