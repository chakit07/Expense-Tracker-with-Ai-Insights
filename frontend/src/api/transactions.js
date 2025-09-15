import axios from 'axios';

const API_URL = 'https://expense-tracker-with-ai-insights-backend.onrender.com/api/transactions';

// Create an Axios instance for API calls
const api = axios.create({
  baseURL: API_URL,
});

// Function to get the auth token and set headers
const getAuthHeaders = async (auth) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const token = await user.getIdToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchTransactionsAPI = async (auth) => {
  const config = await getAuthHeaders(auth);
  const response = await api.get('/', config);
  return response.data;
};

export const addTransactionAPI = async (transactionData, auth) => {
  const config = await getAuthHeaders(auth);
  const response = await api.post('/', transactionData, config);
  return response.data;
};

export const updateTransactionAPI = async (id, transactionData, auth) => {
  const config = await getAuthHeaders(auth);
  const response = await api.put(`/${id}`, transactionData, config);
  return response.data;
};

export const deleteTransactionAPI = async (id, auth) => {
  const config = await getAuthHeaders(auth);
  const response = await api.delete(`/${id}`, config);
  return response.data;
};
