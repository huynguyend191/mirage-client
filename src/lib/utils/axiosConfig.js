import axios from 'axios';

const baseURL = "https://mirage-video-call.herokuapp.com/api"

const axiosRequest = axios.create({
  baseURL,
  withCredentials: true
});

export default axiosRequest;