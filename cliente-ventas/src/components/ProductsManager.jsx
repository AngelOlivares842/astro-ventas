import React, { useState, useEffect } from 'react';
import { getProductos, deleteProducto } from '../lib/api';
import { Edit, Trash2, Plus, Search } from 'lucide-react';

const ProductsManager = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data } = await getProductos();
      // Asegurarse de que data sea un array (dependiendo de si tu API pagina los resultados)
      setProductos(Array.isArray(data) ? data : data.results || []); 
    } catch (error) {
      console.error("Error cargando productos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(confirm('¿Estás seguro de eliminar este producto?')) {
        await deleteProducto(id);
        loadData();
    }
  };

  const filtered = productos.filter(p => p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="text-neon-blue animate-pulse">Cargando sistema...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Inventario</h2>
        <button className="bg-neon-blue text-black font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 shadow-neon transition-all flex items-center gap-2">
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-500" size={20} />
        <input 
            type="text" 
            placeholder="Buscar producto..." 
            className="w-full bg-cyber-gray border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-neon-blue focus:outline-none transition-colors"
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid de Productos Futurista */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((prod) => (
            <div key={prod.id} className="bg-cyber-gray border border-white/5 p-4 rounded-xl hover:border-neon-blue/50 transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-neon-blue to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-white">{prod.nombre}</h3>
                        <p className="text-sm text-gray-400">Stock: {prod.cantidad || 0}</p>
                    </div>
                    <span className="text-neon-blue font-mono text-lg">${prod.precio}</span>
                </div>
                <div className="mt-4 flex gap-2 justify-end">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-neon-blue transition-colors">
                        <Edit size={18} />
                    </button>
                    <button 
                        onClick={() => handleDelete(prod.id)}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsManager;