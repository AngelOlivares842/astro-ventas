import React, { useState, useEffect } from 'react';
import { getProductos, getVentas, getClientes } from '../lib/api'; 
import { 
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, 
    AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { 
    Package, DollarSign, Users, Activity, 
    ArrowUpRight, Clock, ShoppingBag 
} from 'lucide-react';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalVentas: 0,
    ventasCount: 0,
    clientesCount: 0,
    ticketPromedio: 0
  });
  
  const [pieData, setPieData] = useState([]);   
  const [areaData, setAreaData] = useState([]); 
  const [recentSales, setRecentSales] = useState([]); 
  const [loading, setLoading] = useState(true);

  // Paleta Cyberpunk
  const COLORS = ['#00f3ff', '#bc13fe', '#ff0055', '#faff00', '#00ff9d'];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, ventasRes, cliRes] = await Promise.all([
            getProductos(),
            getVentas(),
            getClientes()
        ]);

        const productos = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.results || []);
        const ventas = Array.isArray(ventasRes.data) ? ventasRes.data : (ventasRes.data.results || []);
        const clientes = Array.isArray(cliRes.data) ? cliRes.data : (cliRes.data.results || []);
        
        const totalDinero = ventas.reduce((acc, v) => acc + parseFloat(v.total || 0), 0);
        const ticketProm = ventas.length > 0 ? totalDinero / ventas.length : 0;

        const ventasOrdenadas = [...ventas].reverse().slice(0, 5);
        
        const ventasPorDia = ventas.reduce((acc, venta) => {
            const fecha = new Date(venta.fecha_venta || venta.created_at || Date.now());
            const dia = fecha.toLocaleDateString('es-ES', { weekday: 'short' });
            const key = dia.charAt(0).toUpperCase() + dia.slice(1);
            acc[key] = (acc[key] || 0) + 1; 
            return acc;
        }, {});
        const finalPieData = Object.keys(ventasPorDia).map(key => ({ name: key, value: ventasPorDia[key] }));

        const finalAreaData = ventas.map((v, i) => ({
            name: `Venta ${i + 1}`,
            total: parseFloat(v.total)
        })).slice(-10); 

        setStats({
            totalProductos: productos.length,
            totalVentas: totalDinero,
            ventasCount: ventas.length,
            clientesCount: clientes.length,
            ticketPromedio: ticketProm
        });
        
        setPieData(finalPieData.length ? finalPieData : [{name: 'Sin datos', value: 1}]);
        setAreaData(finalAreaData);
        setRecentSales(ventasOrdenadas);

      } catch (error) {
        console.error("Error dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
        <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-neon-blue/20 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border-4 border-t-neon-blue rounded-full animate-spin"></div>
        </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-700">
      
      {/* 1. SECCIÓN DE TARJETAS (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ... (Las tarjetas se mantienen igual) ... */}
        
        {/* Card: Ingresos */}
        <div className="bg-cyber-gray p-5 rounded-xl border border-white/5 relative overflow-hidden group hover:border-neon-blue/40 transition-all shadow-lg">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-neon-blue/10 rounded-full blur-xl group-hover:bg-neon-blue/20 transition-all"></div>
            <div className="flex justify-between items-start z-10 relative">
                <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Ingresos Totales</p>
                    <h3 className="text-3xl font-bold text-white mt-1 font-mono">${stats.totalVentas.toLocaleString()}</h3>
                </div>
                <div className="p-2 bg-neon-blue/10 rounded text-neon-blue"><DollarSign size={20}/></div>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-400 font-mono">
                <ArrowUpRight size={14} className="mr-1"/> +12% vs mes anterior
            </div>
        </div>

        {/* Card: Ventas # */}
        <div className="bg-cyber-gray p-5 rounded-xl border border-white/5 relative overflow-hidden group hover:border-neon-purple/40 transition-all shadow-lg">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-neon-purple/10 rounded-full blur-xl group-hover:bg-neon-purple/20 transition-all"></div>
            <div className="flex justify-between items-start z-10 relative">
                <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Transacciones</p>
                    <h3 className="text-3xl font-bold text-white mt-1 font-mono">{stats.ventasCount}</h3>
                </div>
                <div className="p-2 bg-neon-purple/10 rounded text-neon-purple"><ShoppingBag size={20}/></div>
            </div>
             <div className="mt-4 flex items-center text-xs text-neon-purple font-mono">
                Ticket Prom: ${stats.ticketPromedio.toFixed(0)}
            </div>
        </div>

        {/* Card: Clientes */}
        <div className="bg-cyber-gray p-5 rounded-xl border border-white/5 relative overflow-hidden group hover:border-pink-500/40 transition-all shadow-lg">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-pink-500/10 rounded-full blur-xl group-hover:bg-pink-500/20 transition-all"></div>
            <div className="flex justify-between items-start z-10 relative">
                <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Clientes Activos</p>
                    <h3 className="text-3xl font-bold text-white mt-1 font-mono">{stats.clientesCount}</h3>
                </div>
                <div className="p-2 bg-pink-500/10 rounded text-pink-500"><Users size={20}/></div>
            </div>
            <div className="mt-4 w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                <div className="bg-pink-500 h-full w-[70%]"></div>
            </div>
        </div>

        {/* Card: Inventario */}
        <div className="bg-cyber-gray p-5 rounded-xl border border-white/5 relative overflow-hidden group hover:border-yellow-400/40 transition-all shadow-lg">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-400/10 rounded-full blur-xl group-hover:bg-yellow-400/20 transition-all"></div>
            <div className="flex justify-between items-start z-10 relative">
                <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Inventario</p>
                    <h3 className="text-3xl font-bold text-white mt-1 font-mono">{stats.totalProductos}</h3>
                </div>
                <div className="p-2 bg-yellow-400/10 rounded text-yellow-400"><Package size={20}/></div>
            </div>
             <div className="mt-4 flex items-center text-xs text-yellow-400 font-mono">
                <Activity size={14} className="mr-1"/> Estado: Saludable
            </div>
        </div>
      </div>

      {/* 2. SECCIÓN DE GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico Principal: ÁREA (Tendencia) */}
        <div className="lg:col-span-2 bg-cyber-gray p-6 rounded-xl border border-white/5 shadow-2xl relative">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="text-neon-blue"/> Tendencia de Ingresos
            </h2>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaData}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis dataKey="name" hide />
                        {/* Corrección de color en Ejes */}
                        <YAxis stroke="#666" fontSize={12} tick={{fill: '#9ca3af'}} tickFormatter={(value) => `$${value/1000}k`} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0a0a12', borderColor: '#333', color: '#fff' }}
                            itemStyle={{ color: '#00f3ff' }}
                            formatter={(value) => [`$${value}`, 'Ingreso']}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="total" 
                            stroke="#00f3ff" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorTotal)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Gráfico Secundario: DONUT (Distribución) */}
        <div className="bg-cyber-gray p-6 rounded-xl border border-white/5 shadow-2xl relative flex flex-col items-center justify-center">
             <h2 className="text-lg font-bold text-white mb-2 w-full text-left flex items-center gap-2">
                <Clock className="text-neon-purple"/> Ventas por Día
            </h2>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0a0a12', borderColor: '#333', color: '#fff', borderRadius: '8px' }}
                        />
                        <Legend 
                            verticalAlign="bottom" 
                            height={36} 
                            formatter={(value) => <span className="text-white font-mono ml-2 text-xs">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* 3. SECCIÓN INFERIOR: ÚLTIMAS TRANSACCIONES */}
      <div className="bg-cyber-gray border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
            <h3 className="text-white font-bold flex items-center gap-2">
                <ArrowUpRight className="text-green-400" /> Transacciones Recientes
            </h3>
            <span className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">En vivo</span>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-gray-400 text-xs uppercase bg-black/20">
                        <th className="px-6 py-3">ID Venta</th>
                        <th className="px-6 py-3">Cliente</th>
                        <th className="px-6 py-3">Fecha</th>
                        <th className="px-6 py-3 text-right">Total</th>
                        <th className="px-6 py-3 text-center">Estado</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {recentSales.length === 0 ? (
                        <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No hay ventas recientes</td></tr>
                    ) : (
                        recentSales.map((venta) => (
                            <tr key={venta.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4 text-sm text-neon-blue font-mono">#{venta.id}</td>
                                <td className="px-6 py-4 text-sm text-white font-medium">
                                    {venta.cliente_nombre || 'Cliente Final'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-400">
                                    {new Date(venta.fecha_venta || venta.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-white font-mono text-right">
                                    ${parseFloat(venta.total).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                                        Completado
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;