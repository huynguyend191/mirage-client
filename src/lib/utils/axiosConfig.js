import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'development' ? 'https://localhost:3003/api' : 'https://mirage.social/api';

const axiosRequest = axios.create({
  baseURL,
  withCredentials: true
});

export default axiosRequest;
