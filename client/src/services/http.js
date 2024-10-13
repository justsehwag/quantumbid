import axios from 'axios';
import auth from './auth';

axios.defaults.baseURL = import.meta.env.VITE_BASE_API_URL;
axios.defaults.headers.common = {
  Authorization: `Bearer ${auth.getAuthToken()}`,
};

export default {
  get: axios.get,
  put: axios.put,
  post: axios.post,
  delete: axios.delete,
  patch: axios.patch,
};
