import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 supports-[backdrop-filter]:bg-white/60 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-tr from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900 leading-5">Fiber Network Topology</h1>
              <p className="text-xs text-gray-500">Network Management System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { to: '/', label: 'Dashboard' },
              { to: '/topology', label: 'Network Topology' },
              { to: '/monitoring', label: 'Monitoring' },
              { to: '/reports', label: 'Reports' },
            ].map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    active
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button className="hidden sm:inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              Search
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center shadow">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-700">Admin</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
