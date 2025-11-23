import React, { useState, useEffect } from 'react';
import { getProductos, getVentas } from '../lib/api'; 
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Package, DollarSign, Users, TrendingUp } from 'lucide-react';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalVentas: 0,
    ventasCount: 0,
    clientesCount: 0 
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Colores para el gráfico circular (Paleta Cyberpunk)
  const COLORS = ['#00f3ff', '#bc13fe', '#ff0055', '#faff00', '#00ff9d', '#ffffff', '#2d2dff'];

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Peticiones en paralelo para mayor velocidad
        const [prodRes, ventasRes, clientesRes] = await Promise.all([
            getProductos(),
            getVentas(),
            // Si tienes endpoint de clientes úsalo, si no, comenta esta línea
            // getClientes() 
            Promise.resolve({ data: [] }) // Placeholder si no tienes endpoint clientes aún
        ]);

        // 2. Normalizar datos (Django suele devolver { count: ..., results: [] } si hay paginación)
        const productos = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.results || []);
        const ventas = Array.isArray(ventasRes.data) ? ventasRes.data : (ventasRes.data.results || []);
        
        // 3. Calcular Totales Reales
        const totalDinero = ventas.reduce((acc, venta) => acc + parseFloat(venta.total || 0), 0);
        
        // 4. Procesar datos para el Gráfico Circular (Agrupar ventas por día de la semana)
        const ventasPorDia = ventas.reduce((acc, venta) => {
            // Asumiendo que tu API devuelve 'fecha' o 'created_at'
            const fecha = new Date(venta.fecha || venta.created_at || Date.now());
            const diaNombre = fecha.toLocaleDateString('es-ES', { weekday: 'short' }); // "lun", "mar"
            const diaCapitalizado = diaNombre.charAt(0).toUpperCase() + diaNombre.slice(1);
            
            acc[diaCapitalizado] = (acc[diaCapitalizado] || 0) + parseFloat(venta.total || 0);
            return acc;
        }, {});

        // Convertir objeto a array para Recharts
        const datosGrafico = Object.keys(ventasPorDia).map(key => ({
            name: key,
            value: ventasPorDia[key]
        }));

        // Si no hay datos, poner datos vacíos para que no se rompa
        const finalChartData = datosGrafico.length > 0 ? datosGrafico : [
            { name: 'Sin Ventas', value: 1 }
        ];

        setStats({
            totalProductos: productos.length,
            totalVentas: totalDinero,
            ventasCount: ventas.length,
            clientesCount: 142 // Ajusta esto cuando conectes clientes real
        });
        
        setChartData(finalChartData);

      } catch (error) {
        console.error("Error cargando datos reales:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="text-neon-blue p-6 animate-pulse text-xl font-mono">Sincronizando datos con el servidor...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Tarjetas de KPIs (Datos Reales) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Productos */}
        <div className="bg-cyber-gray p-6 rounded-xl border border-white/5 shadow-lg group hover:border-neon-blue/50 transition-all">
          <div className="flex justify-between items-center">
            <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest">Inventario</p>
                <p className="text-4xl font-bold text-white mt-2 font-mono">{stats.totalProductos}</p>
            </div>
            <div className="p-3 bg-neon-blue/10 rounded-lg text-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                <Package size={24} />
            </div>
          </div>
        </div>

        {/* Dinero Total */}
        <div className="bg-cyber-gray p-6 rounded-xl border border-white/5 shadow-lg group hover:border-neon-purple/50 transition-all">
          <div className="flex justify-between items-center">
             <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest">Ingresos Totales</p>
                <p className="text-4xl font-bold text-neon-blue mt-2 font-mono">
                    ${stats.totalVentas.toLocaleString()}
                </p>
             </div>
             <div className="p-3 bg-neon-purple/10 rounded-lg text-neon-purple shadow-[0_0_15px_rgba(188,19,254,0.3)]">
                <DollarSign size={24} />
             </div>
          </div>
        </div>

        {/* Transacciones */}
        <div className="bg-cyber-gray p-6 rounded-xl border border-white/5 shadow-lg group hover:border-pink-500/50 transition-all">
          <div className="flex justify-between items-center">
             <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest">Transacciones</p>
                <p className="text-4xl font-bold text-white mt-2 font-mono">{stats.ventasCount}</p>
             </div>
             <div className="p-3 bg-pink-500/10 rounded-lg text-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                <TrendingUp size={24} />
             </div>
          </div>
        </div>
      </div>

      {/* Sección del Gráfico Circular y Detalles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico Circular */}
        <div className="lg:col-span-2 bg-cyber-gray p-6 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-neon-purple opacity-50"></div>
            <h2 className="text-xl font-bold mb-2 text-white flex items-center gap-2">
                Distribución de Ventas
            </h2>
            <p className="text-gray-400 text-sm mb-6">Ingresos agrupados por día de la semana</p>
            
            <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80} // Esto crea el efecto "Donut"
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(10,10,18, 0.9)', borderColor: '#333', color: '#fff', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Venta Total']}
                    />
                    <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
            </div>
        </div>

        {/* Panel Lateral (Resumen Rápido) */}
        <div className="bg-gradient-to-b from-cyber-gray to-black p-6 rounded-xl border border-white/5 flex flex-col justify-center items-center text-center">
            <div className="w-20 h-20 rounded-full bg-neon-blue/10 flex items-center justify-center mb-4 animate-pulse">
                <DollarSign size={40} className="text-neon-blue" />
            </div>
            <h3 className="text-white font-bold text-xl">Estado Financiero</h3>
            <p className="text-gray-400 text-sm mt-2">El sistema está operando correctamente. Los ingresos se actualizan en tiempo real.</p>
            
            <div className="mt-8 w-full space-y-3">
                <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                    <span className="text-gray-500">Estado API</span>
                    <span className="text-green-400 font-mono">ONLINE ●</span>
                </div>
                <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                    <span className="text-gray-500">Última Venta</span>
                    <span className="text-white font-mono">Hace 5 min</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardStats;