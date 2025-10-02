import React, { useState } from 'react';

const FiberRoutes = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [filter, setFilter] = useState('all');

  const fiberRoutes = [
    {
      id: 'FR-001',
      name: 'Main Backbone Route',
      startPoint: 'Data Center A',
      endPoint: 'Data Center B',
      distance: '15.2 km',
      fiberCount: 144,
      status: 'operational',
      bandwidth: '100G',
      utilization: 78,
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-04-10'
    },
    {
      id: 'FR-002',
      name: 'North-South Route',
      startPoint: 'Node N-1',
      endPoint: 'Node S-1',
      distance: '8.7 km',
      fiberCount: 72,
      status: 'operational',
      bandwidth: '40G',
      utilization: 45,
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-04-05'
    },
    {
      id: 'FR-003',
      name: 'East-West Route',
      startPoint: 'Node E-1',
      endPoint: 'Node W-1',
      distance: '12.1 km',
      fiberCount: 96,
      status: 'maintenance',
      bandwidth: '40G',
      utilization: 32,
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-01-20'
    },
    {
      id: 'FR-004',
      name: 'Metro Ring Route',
      startPoint: 'Metro Hub',
      endPoint: 'Metro Hub',
      distance: '25.8 km',
      fiberCount: 288,
      status: 'operational',
      bandwidth: '100G',
      utilization: 89,
      lastMaintenance: '2024-01-08',
      nextMaintenance: '2024-04-08'
    },
    {
      id: 'FR-005',
      name: 'Suburban Route',
      startPoint: 'Suburb A',
      endPoint: 'Suburb B',
      distance: '6.3 km',
      fiberCount: 48,
      status: 'operational',
      bandwidth: '10G',
      utilization: 23,
      lastMaintenance: '2024-01-12',
      nextMaintenance: '2024-04-12'
    }
  ];

  const filteredRoutes = fiberRoutes.filter(route => {
    if (filter === 'all') return true;
    return route.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUtilizationColor = (utilization) => {
    if (utilization > 80) return 'text-red-600';
    if (utilization > 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fiber Routes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor fiber optic cable routes
          </p>
        </div>
        <button className="btn-primary">Add New Route</button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <div className="flex space-x-2">
            {[
              { value: 'all', label: 'All Routes' },
              { value: 'operational', label: 'Operational' },
              { value: 'maintenance', label: 'Maintenance' },
              { value: 'error', label: 'Error' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                  filter === option.value
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredRoutes.map((route) => (
          <div
            key={route.id}
            className={`card cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedRoute?.id === route.id ? 'ring-2 ring-primary-500' : ''
            }`}
            onClick={() => setSelectedRoute(route)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{route.name}</h3>
                <p className="text-sm text-gray-500">{route.id}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(route.status)}`}>
                {route.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Route</span>
                <span className="text-sm font-medium text-gray-900">
                  {route.startPoint} → {route.endPoint}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Distance</span>
                <span className="text-sm font-medium text-gray-900">{route.distance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Fiber Count</span>
                <span className="text-sm font-medium text-gray-900">{route.fiberCount} fibers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Bandwidth</span>
                <span className="text-sm font-medium text-gray-900">{route.bandwidth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Utilization</span>
                <span className={`text-sm font-medium ${getUtilizationColor(route.utilization)}`}>
                  {route.utilization}%
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    route.utilization > 80 ? 'bg-red-500' :
                    route.utilization > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${route.utilization}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Route Details */}
      {selectedRoute && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Route Details - {selectedRoute.name}</h3>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Route Information</label>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Route ID</span>
                    <span className="text-sm font-medium text-gray-900">{selectedRoute.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Start Point</span>
                    <span className="text-sm font-medium text-gray-900">{selectedRoute.startPoint}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">End Point</span>
                    <span className="text-sm font-medium text-gray-900">{selectedRoute.endPoint}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Distance</span>
                    <span className="text-sm font-medium text-gray-900">{selectedRoute.distance}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Technical Specifications</label>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Fiber Count</span>
                    <span className="text-sm font-medium text-gray-900">{selectedRoute.fiberCount} fibers</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Bandwidth</span>
                    <span className="text-sm font-medium text-gray-900">{selectedRoute.bandwidth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Utilization</span>
                    <span className={`text-sm font-medium ${getUtilizationColor(selectedRoute.utilization)}`}>
                      {selectedRoute.utilization}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Maintenance Schedule</label>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Maintenance</span>
                    <span className="text-sm font-medium text-gray-900">{selectedRoute.lastMaintenance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Next Maintenance</span>
                    <span className="text-sm font-medium text-gray-900">{selectedRoute.nextMaintenance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRoute.status)}`}>
                      {selectedRoute.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Performance Metrics</label>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Latency</span>
                    <span className="text-sm font-medium text-gray-900">12.5 ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Packet Loss</span>
                    <span className="text-sm font-medium text-gray-900">0.01%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Uptime</span>
                    <span className="text-sm font-medium text-gray-900">99.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button className="btn-primary">Edit Route</button>
            <button className="btn-secondary">View Map</button>
            <button className="btn-secondary">Test Connection</button>
            <button className="btn-secondary">Schedule Maintenance</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiberRoutes;
