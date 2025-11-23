import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'https://ventas-produccion-1f4baea70467.herokuapp.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token en cada petición
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Funciones de servicio
export const login = async (username, password) => {
    // Ajusta la ruta según tu endpoint real de token (ej: /token/ o /login/)
    // Asumiré que usas SimpleJWT o similar. Si no tienes endpoint de token, avísame.
    const { data } = await api.post('/token/', { username, password }); 
    Cookies.set('access_token', data.access, { expires: 1 }); // Expira en 1 día
    return data;
};

export const getProductos = () => api.get('/productos/');
export const deleteProducto = (id) => api.delete(`/productos/${id}/`);
export const saveProducto = (data, id = null) => id ? api.put(`/productos/${id}/`, data) : api.post('/productos/', data);

export const getVentas = () => api.get('/ventas/');
// ... Agrega aquí funciones para clientes y ventas según necesites

export default api;