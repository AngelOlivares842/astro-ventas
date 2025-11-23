import React, { useState } from 'react';
import { login } from '../lib/api';
import { Lock, User, ArrowRight, Hexagon } from 'lucide-react';

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.username, formData.password);
      window.location.href = '/panel';
    } catch (err) {
      setError('Acceso denegado. Verifica tus credenciales.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Tarjeta con efecto Glassmorphism */}
      <div className="bg-cyber-gray/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 relative overflow-hidden">
        
        {/* Borde superior brillante */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50"></div>

        {/* Header del Login */}
        <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-neon-blue blur-lg opacity-40 animate-pulse"></div>
                    <Hexagon className="text-neon-blue relative z-10" size={48} strokeWidth={1.5} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-widest">VENTAS <span className="text-neon-blue">ZENS</span></h1>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-2">Sistema de Control de Producción</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Usuario */}
          <div className="space-y-2">
            <div className="relative group">
              <User className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-neon-blue transition-colors" size={20} />
              <input
                type="text"
                className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue focus:outline-none transition-all"
                placeholder="Usuario / Email"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          {/* Input Contraseña */}
          <div className="space-y-2">
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-neon-blue transition-colors" size={20} />
              <input
                type="password"
                className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue focus:outline-none transition-all"
                placeholder="Contraseña"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-bounce">
                {error}
            </div>
          )}

          {/* Botón de Acción */}
          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] transition-all flex justify-center items-center gap-2 group mt-4"
          >
            {loading ? (
                <span className="animate-pulse">Verificando...</span>
            ) : (
                <>
                    INGRESAR AL SISTEMA
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
            )}
          </button>
        </form>

        {/* Footer discreto */}
        <div className="mt-8 text-center">
            <p className="text-gray-600 text-xs">© 2025 Secure Access v2.0</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;