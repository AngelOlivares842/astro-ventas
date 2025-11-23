import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { ShoppingCart, Plus, Minus, X, CheckCircle, Package } from 'lucide-react';

const SalesRegister = () => {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
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
            setProductos(Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.results || []);
            setClientes(Array.isArray(cliRes.data) ? cliRes.data : cliRes.data.results || []);
        } catch (e) { 
            console.error("Error cargando recursos", e); 
        } finally { 
            setLoading(false); 
        }
    };
    loadResources();
  }, []);

  const addToCart = (producto) => {
      // CORRECCIÓN: Usamos 'codigo' en lugar de 'id'
      if (!producto.codigo) {
          alert("Error: El producto no tiene el campo 'codigo'.");
          return;
      }

      const existing = carrito.find(item => item.codigo === producto.codigo);

      if (existing) {
          setCarrito(carrito.map(item => 
              item.codigo === producto.codigo ? {...item, cantidad: item.cantidad + 1} : item
          ));
      } else {
          setCarrito([...carrito, { ...producto, cantidad: 1 }]);
      }
  };

  const removeFromCart = (codigo) => {
      setCarrito(carrito.filter(item => item.codigo !== codigo));
  };

  const updateQuantity = (codigo, delta) => {
      setCarrito(carrito.map(item => {
          if (item.codigo === codigo) {
              const newCant = Math.max(1, item.cantidad + delta);
              return { ...item, cantidad: newCant };
          }
          return item;
      }));
  };

  const total = carrito.reduce((acc, item) => acc + (parseFloat(item.precio) * item.cantidad), 0);

  const handleFinalizarVenta = async () => {
      if (!clienteSeleccionado) return alert("Selecciona un cliente");
      if (carrito.length === 0) return alert("El carrito está vacío");
      
      const payload = {
          cliente: clienteSeleccionado, 
          total: total,
          detalles: carrito.map(p => ({
              producto_id: p.codigo,
              cantidad: p.cantidad,
              precio_unitario: p.precio
          }))
      };

      try {
          await api.post('/ventas/', payload);
          alert("¡Venta registrada exitosamente!");
          setCarrito([]);
          setClienteSeleccionado('');
      } catch (e) {
          console.error(e);
          alert("Error al registrar venta. Revisa la consola.");
      }
  };

  if (loading) return <div className="text-neon-blue p-8 animate-pulse">Cargando sistema...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
        
        {/* Catálogo */}
        <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Package className="text-neon-blue"/> Catálogo
            </h2>
            <div className="bg-cyber-dark border border-white/5 rounded-xl p-4 flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {productos.map((prod) => (
                        <button 
                            key={prod.codigo} // CORRECCIÓN: Key es el codigo
                            onClick={() => addToCart(prod)}
                            className="bg-cyber-gray p-4 rounded-lg border border-white/5 hover:border-neon-blue hover:shadow-neon text-left transition-all group flex flex-col justify-between"
                        >
                            <div>
                                <h4 className="font-bold text-white text-sm group-hover:text-neon-blue truncate">{prod.nombre}</h4>
                                <span className="text-[10px] text-gray-600">COD: {prod.codigo}</span>
                            </div>
                            <div className="flex justify-between mt-2 items-center">
                                <span className="text-gray-400 text-xs">Stock: {prod.stock}</span>
                                <span className="text-neon-blue font-mono">${prod.precio}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Carrito */}
        <div className="bg-cyber-gray border border-white/10 rounded-xl p-6 flex flex-col shadow-2xl h-full">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ShoppingCart className="text-neon-purple"/> Orden Actual
            </h2>

            <div className="mb-4">
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

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 mb-4 custom-scrollbar">
                {carrito.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-600 opacity-50">
                        <ShoppingCart size={40} className="mb-2"/>
                        <p className="italic text-sm">Carrito vacío</p>
                    </div>
                ) : (
                    carrito.map((item) => (
                        <div key={item.codigo} className="flex justify-between items-center bg-white/5 p-3 rounded border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="overflow-hidden">
                                <div className="text-sm text-white font-medium truncate w-32">{item.nombre}</div>
                                <div className="text-xs text-neon-purple font-mono">
                                    ${item.precio} x {item.cantidad} = ${(item.precio * item.cantidad).toFixed(2)}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1">
                                <button onClick={() => updateQuantity(item.codigo, -1)} className="p-1 hover:text-white text-gray-400 hover:bg-white/10 rounded"><Minus size={14}/></button>
                                <span className="text-sm font-bold w-4 text-center">{item.cantidad}</span>
                                <button onClick={() => updateQuantity(item.codigo, 1)} className="p-1 hover:text-white text-gray-400 hover:bg-white/10 rounded"><Plus size={14}/></button>
                            </div>
                            <button onClick={() => removeFromCart(item.codigo)} className="ml-2 text-gray-500 hover:text-red-500 transition-colors"><X size={16}/></button>
                        </div>
                    ))
                )}
            </div>

            <div className="border-t border-white/10 pt-4 mt-auto bg-cyber-gray">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400 uppercase text-xs tracking-widest">Total a Pagar</span>
                    <span className="text-3xl font-bold text-white font-mono">${total.toFixed(2)}</span>
                </div>
                <button 
                    onClick={handleFinalizarVenta}
                    className="w-full bg-gradient-to-r from-neon-purple to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-4 rounded-lg shadow-neon-purple transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={carrito.length === 0}
                >
                    <CheckCircle size={20} /> FINALIZAR VENTA
                </button>
            </div>
        </div>
    </div>
  );
};

export default SalesRegister;