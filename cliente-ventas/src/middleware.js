import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'https://ventas-produccion-1f4baea70467.herokuapp.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor de Petición (Envía el token)
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- NUEVO: Interceptor de Respuesta (Maneja la expulsión) ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si la API dice "401 Unauthorized" (Token inválido o expirado)
    if (error.response && error.response.status === 401) {
      // 1. Borramos la cookie
      Cookies.remove('access_token');
      // 2. Redirigimos al usuario al login forzosamente
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// ... (tus funciones login, getProductos, etc. siguen igual) ...

// Agregamos una función explícita para cerrar sesión
export const logout = () => {
    Cookies.remove('access_token');
    window.location.href = '/';
};

export default api; // y tus exportaciones...