import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardStats from './DashboardStats';
import ProductsManager from './ProductsManager';
import ClientsManager from './ClientsManager';
import SalesRegister from './SalesRegister';

const AppLayout = () => {
  const [view, setView] = useState('dashboard');

  // Función para renderizar la vista activa
  const renderContent = () => {
    switch(view) {
      case 'dashboard': return <DashboardStats />;
      case 'productos': return <ProductsManager />;
      case 'clientes':  return <ClientsManager />;
      case 'ventas':    return <SalesRegister />;
      default: return <DashboardStats />;
    }
  };

  return (
    <div className="flex h-screen bg-cyber-black text-white overflow-hidden">
      {/* Sidebar Fijo */}
      <Sidebar currentView={view} setView={setView} />
      
      {/* Área Principal Scrollable */}
      <main className="flex-1 ml-64 p-8 h-full overflow-y-auto bg-[url('/grid-bg-dark.png')] relative">
        {/* Overlay sutil para el fondo */}
        <div className="fixed inset-0 bg-cyber-black/90 pointer-events-none -z-10"></div>
        
        <header className="mb-8 flex justify-between items-center backdrop-blur-sm py-2 sticky top-0 z-10">
             <div>
                <h2 className="text-neon-blue text-xs font-bold uppercase tracking-widest mb-1">Sistema de Control</h2>
                <p className="text-white text-xl font-light tracking-tight">Panel Administrativo</p>
             </div>
             <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">Admin User</span>
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-neon-blue to-purple-600 border border-white/20 shadow-neon"></div>
             </div>
        </header>

        <div className="relative z-0">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;