import React, { useState, useEffect } from 'react';
import api from '../lib/api'; // Asumiendo que exportas api por defecto
import { Users, Mail, Phone, Trash2, Plus, Search } from 'lucide-react';

const ClientsManager = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar clientes
  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
        // Ajusta '/clientes/' según tu API exacta
        const { data } = await api.get('/clientes/'); 
        setClientes(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id) => {
      if(!confirm("¿Eliminar cliente?")) return;
      try {
          await api.delete(`/clientes/${id}/`);
          fetchClientes();
      } catch(e) { alert("Error al eliminar"); }
  };

  const filtered = clientes.filter(c => 
    c.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="text-neon-purple" /> Base de Clientes
            </h2>
            <p className="text-gray-400 text-sm">Gestiona tu cartera de clientes</p>
        </div>
        <button className="bg-neon-purple/10 text-neon-purple border border-neon-purple hover:bg-neon-purple hover:text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2">
          <Plus size={18} /> Nuevo Cliente
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-500" size={20} />
        <input 
            type="text" 
            placeholder="Buscar por nombre o correo..." 
            className="w-full bg-cyber-gray border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-neon-purple focus:outline-none transition-colors"
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <p className="text-white">Cargando...</p> : filtered.map((cliente) => (
            <div key={cliente.id} className="bg-cyber-gray p-5 rounded-xl border border-white/5 hover:border-neon-purple/50 transition-all shadow-lg group">
                <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-900 to-black flex items-center justify-center text-neon-purple font-bold text-xl border border-white/10">
                        {cliente.nombre ? cliente.nombre.substring(0,2).toUpperCase() : 'CL'}
                    </div>
                    <button onClick={() => handleDelete(cliente.id)} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{cliente.nombre}</h3>
                
                <div className="space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Mail size={14} className="text-neon-purple"/> {cliente.email || 'Sin correo'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Phone size={14} className="text-neon-purple"/> {cliente.telefono || 'Sin teléfono'}
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsManager;