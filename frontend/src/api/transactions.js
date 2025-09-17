import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/transactions`;

// Create an Axios instance for API calls
const api = axios.create({
  baseURL: API_URL,
});

// Function to get the auth headers with token
const getAuthHeaders = (token) => {
  if (!token) throw new Error("Token not provided");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchTransactionsAPI = async (token) => {
  const config = getAuthHeaders(token);
  const response = await api.get('/', config);
  return response.data;
};

export const addTransactionAPI = async (transactionData, token) => {
  const config = getAuthHeaders(token);
  const response = await api.post('/', transactionData, config);
  return response.data;
};

export const updateTransactionAPI = async (id, transactionData, token) => {
  const config = getAuthHeaders(token);
  const response = await api.put(`/${id}`, transactionData, config);
  return response.data;
};

export const deleteTransactionAPI = async (id, token) => {
  const config = getAuthHeaders(token);
  const response = await api.delete(`/${id}`, config);
  return response.data;
};
