import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'https://ventas-produccion-1f4baea70467.herokuapp.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptor de Solicitud (REQUEST) ---
// Inyecta el token en cada petición saliente
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Interceptor de Respuesta (RESPONSE) ---
// Vigila si el token expiró o es inválido
api.interceptors.response.use(
  (response) => response, // Si todo sale bien, pasa la respuesta
  (error) => {
    // Si la API responde con error 401 (No Autorizado)
    if (error.response && error.response.status === 401) {
      logout(); // Ejecutamos la expulsión del usuario
    }
    return Promise.reject(error);
  }
);

// --- Funciones de Autenticación ---

export const login = async (username, password) => {
    // Ajusta la ruta si tu backend usa '/login/' en vez de '/token/'
    const { data } = await api.post('/token/', { username, password }); 
    Cookies.set('access_token', data.access, { expires: 1 }); // Guarda cookie por 1 día
    return data;
};

// Función para cerrar sesión (Borra cookie y redirige)
export const logout = () => {
    Cookies.remove('access_token');
    if (typeof window !== 'undefined') {
        window.location.href = '/'; // Redirección forzada al Login
    }
};

// --- Funciones de Datos (Endpoints) ---

// Productos
export const getProductos = () => api.get('/productos/');
export const deleteProducto = (id) => api.delete(`/productos/${id}/`);
export const saveProducto = (data, id = null) => id ? api.put(`/productos/${id}/`, data) : api.post('/productos/', data);

// Ventas
export const getVentas = () => api.get('/ventas/');
// Si necesitas crear venta: export const saveVenta = (data) => api.post('/ventas/', data);

// Clientes (Necesarios para el ClientsManager)
export const getClientes = () => api.get('/clientes/');
export const deleteCliente = (id) => api.delete(`/clientes/${id}/`);

export default api;