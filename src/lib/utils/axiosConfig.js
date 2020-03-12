import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'development'
? 'https://localhost:3003'
: 'http://example.com' ;

const axiosRequest = axios.create({
  baseURL,
  withCredentials: true
});

export default axiosRequest;