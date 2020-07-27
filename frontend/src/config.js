import axios from 'axios';

const headers = {
    'Content-Type': 'application/json'
};

export const axiosConfig = axios.create({
    baseUrl: 'http://localhost:5000/graphql', 
    headers
});
