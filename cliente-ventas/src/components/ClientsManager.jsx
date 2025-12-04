import React, { useState, useEffect } from 'react';
import { getClientes, deleteCliente, saveCliente } from '../lib/api';
import { Users, Mail, Phone, Trash2, Plus, Search, X, Save, UserPlus } from 'lucide-react';

const ClientsManager = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado del Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '', // Importante para tu DB
    email: '',
    telefono: ''
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
        const { data } = await getClientes();
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
          await deleteCliente(id);
          fetchClientes();
      } catch(e) { alert("Error al eliminar"); }
  };

  const handleSave = async (e) => {
      e.preventDefault();
      try {
          // Ajusta 'rut' a 'run' si tu API lo pide así
          await saveCliente(formData);
          alert("Cliente registrado correctamente");
          setShowModal(false);
          setFormData({ nombre: '', rut: '', email: '', telefono: '' });
          fetchClientes();
      } catch (e) {
          console.error(e);
          alert("Error al guardar cliente. Verifica el RUT.");
      }
  };

  const filtered = clientes.filter(c => 
    c.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.rut?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="text-neon-purple" /> Base de Clientes
            </h2>
        </div>
        <button 
            onClick={() => setShowModal(true)}
            className="bg-neon-purple/10 text-neon-purple border border-neon-purple hover:bg-neon-purple hover:text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Nuevo Cliente
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-500" size={20} />
        <input 
            type="text" 
            placeholder="Buscar por nombre o RUT..." 
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
                <p className="text-xs text-gray-500 mb-2">RUT: {cliente.rut || cliente.run}</p>
                
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

      {/* MODAL DE CREACIÓN DE CLIENTE */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-cyber-gray border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
                <button 
                    onClick={() => setShowModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X size={24} />
                </button>
                
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <UserPlus className="text-neon-purple"/> Nuevo Cliente
                </h2>

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-400 uppercase">Nombre Completo</label>
                        <input required type="text" className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-neon-purple outline-none" 
                            value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 uppercase">RUT / DNI</label>
                        <input required type="text" className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-neon-purple outline-none" 
                            value={formData.rut} onChange={e => setFormData({...formData, rut: e.target.value})}
                            placeholder="Ej: 12.345.678-9"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 uppercase">Email</label>
                        <input type="email" className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-neon-purple outline-none" 
                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 uppercase">Teléfono</label>
                        <input type="text" className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-neon-purple outline-none" 
                            value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})}
                        />
                    </div>

                    <button type="submit" className="w-full bg-neon-purple text-white font-bold py-3 rounded-lg hover:bg-purple-600 mt-4 flex justify-center items-center gap-2">
                        <Save size={18} /> Guardar Cliente
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default ClientsManager;