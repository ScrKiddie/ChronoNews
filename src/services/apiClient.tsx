import axios from 'axios';

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

const apiClient = axios.create({
  baseURL: `${apiUri}/api`,
});

export default apiClient;