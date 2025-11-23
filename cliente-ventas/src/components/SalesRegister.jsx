import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { ShoppingCart, Plus, Minus, X, CheckCircle, Package } from 'lucide-react';

const SalesRegister = () => {
  // Estados de datos
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  
  // Estados del carrito
  const [carrito, setCarrito] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
        try {
            const [prodRes, cliRes] = await Promise.all([
                api.get('/productos/'),
                api.get('/clientes/')
            ]);
            setProductos(prodRes.data.results || prodRes.data || []);
            setClientes(cliRes.data.results || cliRes.data || []);
        } catch (e) { console.error("Error cargando recursos", e); } 
        finally { setLoading(false); }
    };
    loadResources();
  }, []);

  const addToCart = (producto) => {
      const existing = carrito.find(item => item.id === producto.id);
      if (existing) {
          setCarrito(carrito.map(item => item.id === producto.id ? {...item, cantidad: item.cantidad + 1} : item));
      } else {
          setCarrito([...carrito, { ...producto, cantidad: 1 }]);
      }
  };

  const removeFromCart = (id) => {
      setCarrito(carrito.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
      setCarrito(carrito.map(item => {
          if (item.id === id) {
              const newCant = Math.max(1, item.cantidad + delta);
              return { ...item, cantidad: newCant };
          }
          return item;
      }));
  };

  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const handleFinalizarVenta = async () => {
      if (!clienteSeleccionado || carrito.length === 0) return alert("Selecciona cliente y productos");
      
      // Estructura del payload (Ajustar según tu Backend Django)
      // Si tu backend espera una venta y luego los detalles, la lógica cambia.
      // Asumiré que tu API acepta un JSON anidado o simple.
      const payload = {
          cliente: clienteSeleccionado, // ID del cliente
          total: total,
          detalles: carrito.map(p => ({
              producto_id: p.id,
              cantidad: p.cantidad,
              precio_unitario: p.precio
          }))
      };

      try {
          await api.post('/ventas/', payload);
          alert("Venta registrada exitosamente 🚀");
          setCarrito([]);
          setClienteSeleccionado('');
      } catch (e) {
          console.error(e);
          alert("Error al registrar la venta");
      }
  };

  if (loading) return <div className="text-neon-blue animate-pulse">Cargando terminal de ventas...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
        
        {/* Lado Izquierdo: Selector de Productos */}
        <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Package className="text-neon-blue"/> Catálogo
            </h2>
            <div className="bg-cyber-dark border border-white/5 rounded-xl p-4 flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {productos.map(prod => (
                        <button 
                            key={prod.id}
                            onClick={() => addToCart(prod)}
                            className="bg-cyber-gray p-4 rounded-lg border border-white/5 hover:border-neon-blue hover:shadow-neon text-left transition-all group"
                        >
                            <h4 className="font-bold text-white text-sm group-hover:text-neon-blue">{prod.nombre}</h4>
                            <div className="flex justify-between mt-2 items-center">
                                <span className="text-gray-400 text-xs">Stock: {prod.cantidad}</span>
                                <span className="text-neon-blue font-mono">${prod.precio}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Lado Derecho: Ticket / Carrito */}
        <div className="bg-cyber-gray border border-white/10 rounded-xl p-6 flex flex-col shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ShoppingCart className="text-neon-purple"/> Orden Actual
            </h2>

            {/* Selector de Cliente */}
            <div className="mb-6">
                <label className="text-xs text-gray-400 uppercase mb-1 block">Cliente</label>
                <select 
                    className="w-full bg-black/30 border border-white/10 rounded p-2 text-white focus:border-neon-purple outline-none"
                    value={clienteSeleccionado}
                    onChange={(e) => setClienteSeleccionado(e.target.value)}
                >
                    <option value="">-- Seleccionar Cliente --</option>
                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
            </div>

            {/* Lista de Items */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 custom-scrollbar">
                {carrito.length === 0 ? (
                    <div className="text-center text-gray-600 mt-10 italic">Carrito vacío</div>
                ) : (
                    carrito.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-white/5 p-3 rounded border border-white/5">
                            <div>
                                <div className="text-sm text-white font-medium">{item.nombre}</div>
                                <div className="text-xs text-neon-purple font-mono">${item.precio * item.cantidad}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-white text-gray-500"><Minus size={14}/></button>
                                <span className="text-sm font-bold">{item.cantidad}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-white text-gray-500"><Plus size={14}/></button>
                                <button onClick={() => removeFromCart(item.id)} className="ml-2 text-red-500 hover:text-red-400"><X size={14}/></button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Totales y Acción */}
            <div className="border-t border-white/10 pt-4 mt-auto">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-400">Total a Pagar</span>
                    <span className="text-3xl font-bold text-white font-mono">${total}</span>
                </div>
                <button 
                    onClick={handleFinalizarVenta}
                    className="w-full bg-neon-purple hover:bg-purple-500 text-white font-bold py-4 rounded-lg shadow-neon-purple transition-all flex justify-center items-center gap-2"
                >
                    <CheckCircle size={20} /> FINALIZAR VENTA
                </button>
            </div>
        </div>
    </div>
  );
};

export default SalesRegister;