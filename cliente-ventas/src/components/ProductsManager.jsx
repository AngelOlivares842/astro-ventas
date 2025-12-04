import React, { useState, useEffect } from 'react';
import { getProductos, deleteProducto, saveProducto } from '../lib/api';
import { Edit, Trash2, Plus, Search, X, Save, Package } from 'lucide-react';

const ProductsManager = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado del Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    precio: '',
    stock: '' // En el formulario lo llamamos stock, pero al enviar será "cantidad"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data } = await getProductos();
      setProductos(Array.isArray(data) ? data : data.results || []); 
    } catch (error) {
      console.error("Error cargando productos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(confirm('¿Eliminar producto del sistema?')) {
        try {
            await deleteProducto(id);
            loadData();
        } catch (e) {
            alert("No se puede eliminar: Es posible que este producto tenga ventas asociadas.");
        }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // 1. CONVERSIÓN DE DATOS (Lo que pediste: Código entero)
    const codigoInt = parseInt(formData.codigo);
    const precioNum = parseFloat(formData.precio);
    const stockInt = parseInt(formData.stock);

    // 2. VALIDACIONES
    if (!formData.nombre.trim()) return alert("El nombre es obligatorio.");
    
    if (isNaN(codigoInt)) return alert("El código debe ser un número entero válido.");
    if (isNaN(precioNum) || precioNum <= 0) return alert("El precio debe ser mayor a 0.");
    if (isNaN(stockInt) || stockInt < 0) return alert("El stock no puede ser negativo.");

    // 3. PREPARAR EL PAYLOAD (Aquí arreglamos el error de la imagen)
    const payload = {
        codigo: codigoInt,      // Enviamos número entero
        nombre: formData.nombre,
        precio: precioNum,
        cantidad: stockInt      // CORRECCIÓN: La API pide "cantidad", no "stock"
    };

    console.log("Enviando producto corregido:", payload);

    try {
        await saveProducto(payload);
        alert("¡Producto guardado exitosamente!");
        setShowModal(false);
        setFormData({ codigo: '', nombre: '', precio: '', stock: '' }); 
        loadData(); 
    } catch (error) {
        console.error("Error al guardar:", error);
        
        if (error.response && error.response.data) {
            const serverError = JSON.stringify(error.response.data, null, 2);
            alert(`El servidor rechazó los datos:\n${serverError}`);
        } else {
            alert("Error desconocido de conexión.");
        }
    }
  };

  const filtered = productos.filter(p => p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Inventario</h2>
        <button 
            onClick={() => setShowModal(true)}
            className="bg-neon-blue text-black font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 shadow-neon transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-500" size={20} />
        <input 
            type="text" 
            placeholder="Buscar producto..." 
            className="w-full bg-cyber-gray border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-neon-blue focus:outline-none transition-colors"
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <p className="text-white animate-pulse">Cargando datos...</p> : filtered.map((prod) => (
            <div key={prod.id || prod.codigo} className="bg-cyber-gray border border-white/5 p-4 rounded-xl hover:border-neon-blue/50 transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-white truncate max-w-[150px]">{prod.nombre}</h3>
                        <p className="text-xs text-gray-500 mb-1">COD: {prod.codigo}</p>
                        {/* Nota: Aquí muestro 'cantidad' porque así llega de tu API */}
                        <p className="text-sm text-gray-400">Stock: {prod.cantidad || prod.stock}</p>
                    </div>
                    <span className="text-neon-blue font-mono text-lg">${prod.precio}</span>
                </div>
                <div className="mt-4 flex gap-2 justify-end">
                    <button onClick={() => handleDelete(prod.id)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-cyber-gray border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
                <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
                
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Package className="text-neon-blue"/> Agregar Producto
                </h2>

                <form onSubmit={handleSave} className="space-y-4">
                    
                    {/* CODIGO (Ahora es type="number") */}
                    <div>
                        <label className="text-xs text-gray-400 uppercase font-bold ml-1">Código (Numérico)</label>
                        <input 
                            required 
                            type="number" 
                            step="1"
                            className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-neon-blue outline-none transition-colors" 
                            placeholder="Ej: 1001"
                            value={formData.codigo} 
                            onChange={e => setFormData({...formData, codigo: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="text-xs text-gray-400 uppercase font-bold ml-1">Nombre</label>
                        <input 
                            required 
                            type="text" 
                            className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-neon-blue outline-none transition-colors" 
                            placeholder="Ej: Monitor Gamer"
                            value={formData.nombre} 
                            onChange={e => setFormData({...formData, nombre: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-400 uppercase font-bold ml-1">Precio</label>
                            <input 
                                required type="number" min="1" step="0.01"
                                className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-neon-blue outline-none transition-colors" 
                                value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 uppercase font-bold ml-1">Stock (Cantidad)</label>
                            <input 
                                required type="number" min="0" step="1"
                                className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-neon-blue outline-none transition-colors" 
                                value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-neon-blue hover:bg-cyan-400 text-black font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all flex justify-center items-center gap-2">
                            <Save size={18} /> Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;