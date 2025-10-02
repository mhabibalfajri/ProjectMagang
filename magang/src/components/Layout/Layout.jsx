import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden md:ml-64">
        <Header />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {/* background pattern */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-white to-white"></div>
          <div className="relative py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
