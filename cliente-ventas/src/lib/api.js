import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'https://ventas-produccion-1f4baea70467.herokuapp.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Petición
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de Respuesta (Maneja error 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);

// Funciones
export const login = async (username, password) => {
    const { data } = await api.post('/token/', { username, password }); 
    // Guardamos la cookie por 1 día
    Cookies.set('access_token', data.access, { expires: 1 }); 
    return data;
};

export const logout = () => {
    Cookies.remove('access_token');
    if (typeof window !== 'undefined') {
        window.location.href = '/';
    }
};

// Endpoints
export const getProductos = () => api.get('/productos/');
export const deleteProducto = (id) => api.delete(`/productos/${id}/`);
export const saveProducto = (data, id = null) => id ? api.put(`/productos/${id}/`, data) : api.post('/productos/', data);

export const getVentas = () => api.get('/ventas/');
export const getClientes = () => api.get('/clientes/');
export const deleteCliente = (id) => api.delete(`/clientes/${id}/`);
export const saveCliente = (data) => api.post('/clientes/', data);

export default api;