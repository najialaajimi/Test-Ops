import axios from 'axios';

const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:5001';
const TASK_SERVICE_URL = process.env.REACT_APP_TASK_SERVICE_URL || 'http://localhost:5002';

const getAuthHeader = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token ? { Authorization: `Bearer ${user.token}` } : {};
  } catch {
    return {};
  }
};

export const userService = {
  register: async (data) => {
    const res = await axios.post(`${USER_SERVICE_URL}/api/users/register`, data);
    return res.data;
  },
  login: async (data) => {
    const res = await axios.post(`${USER_SERVICE_URL}/api/users/login`, data);
    return res.data;
  },
  getProfile: async () => {
    const res = await axios.get(`${USER_SERVICE_URL}/api/users/profile`, {
      headers: getAuthHeader(),
    });
    return res.data;
  },
};

export const taskService = {
  getTasks: async () => {
    const res = await axios.get(`${TASK_SERVICE_URL}/api/tasks`, {
      headers: getAuthHeader(),
    });
    return res.data;
  },
  createTask: async (data) => {
    const res = await axios.post(`${TASK_SERVICE_URL}/api/tasks`, data, {
      headers: getAuthHeader(),
    });
    return res.data;
  },
  updateTask: async (id, data) => {
    const res = await axios.put(`${TASK_SERVICE_URL}/api/tasks/${id}`, data, {
      headers: getAuthHeader(),
    });
    return res.data;
  },
  deleteTask: async (id) => {
    const res = await axios.delete(`${TASK_SERVICE_URL}/api/tasks/${id}`, {
      headers: getAuthHeader(),
    });
    return res.data;
  },
};
