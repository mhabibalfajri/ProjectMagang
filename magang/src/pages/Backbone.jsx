import React, { useState } from 'react';

const Backbone = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [viewMode, setViewMode] = useState('overview');

  const backboneNodes = [
    {
      id: 'BB-001',
      name: 'Core Backbone Node 1',
      location: 'Data Center Alpha',
      type: 'core',
      status: 'operational',
      capacity: '100G',
      utilization: 78,
      connections: 12,
      lastUpdate: '2 minutes ago'
    },
    {
      id: 'BB-002',
      name: 'Core Backbone Node 2',
      location: 'Data Center Beta',
      type: 'core',
      status: 'operational',
      capacity: '100G',
      utilization: 65,
      connections: 10,
      lastUpdate: '1 minute ago'
    },
    {
      id: 'BB-003',
      name: 'Regional Hub North',
      location: 'North Region',
      type: 'regional',
      status: 'operational',
      capacity: '40G',
      utilization: 45,
      connections: 8,
      lastUpdate: '3 minutes ago'
    },
    {
      id: 'BB-004',
      name: 'Regional Hub South',
      location: 'South Region',
      type: 'regional',
      status: 'maintenance',
      capacity: '40G',
      utilization: 32,
      connections: 6,
      lastUpdate: '5 minutes ago'
    },
    {
      id: 'BB-005',
      name: 'Metro Hub East',
      location: 'East Metro',
      type: 'metro',
      status: 'operational',
      capacity: '10G',
      utilization: 89,
      connections: 15,
      lastUpdate: '1 minute ago'
    },
    {
      id: 'BB-006',
      name: 'Metro Hub West',
      location: 'West Metro',
      type: 'metro',
      status: 'operational',
      capacity: '10G',
      utilization: 67,
      connections: 12,
      lastUpdate: '2 minutes ago'
    }
  ];

  const backboneConnections = [
    {
      id: 'BC-001',
      from: 'BB-001',
      to: 'BB-002',
      type: 'core-link',
      bandwidth: '100G',
      status: 'operational',
      latency: '5ms',
      utilization: 45
    },
    {
      id: 'BC-002',
      from: 'BB-001',
      to: 'BB-003',
      type: 'regional-link',
      bandwidth: '40G',
      status: 'operational',
      latency: '12ms',
      utilization: 78
    },
    {
      id: 'BC-003',
      from: 'BB-002',
      to: 'BB-004',
      type: 'regional-link',
      bandwidth: '40G',
      status: 'maintenance',
      latency: '15ms',
      utilization: 32
    },
    {
      id: 'BC-004',
      from: 'BB-003',
      to: 'BB-005',
      type: 'metro-link',
      bandwidth: '10G',
      status: 'operational',
      latency: '8ms',
      utilization: 89
    },
    {
      id: 'BC-005',
      from: 'BB-004',
      to: 'BB-006',
      type: 'metro-link',
      bandwidth: '10G',
      status: 'operational',
      latency: '10ms',
      utilization: 67
    }
  ];

  const getNodeTypeColor = (type) => {
    switch (type) {
      case 'core': return 'bg-blue-600';
      case 'regional': return 'bg-purple-600';
      case 'metro': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Backbone Network</h1>
          <p className="mt-1 text-sm text-gray-500">
            Core backbone infrastructure and high-capacity connections
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('overview')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              viewMode === 'overview'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setViewMode('detailed')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              viewMode === 'detailed'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Detailed View
          </button>
        </div>
      </div>

      {/* Backbone Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Nodes</p>
              <p className="text-2xl font-semibold text-gray-900">{backboneNodes.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Connections</p>
              <p className="text-2xl font-semibold text-gray-900">{backboneConnections.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Capacity</p>
              <p className="text-2xl font-semibold text-gray-900">300G</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Latency</p>
              <p className="text-2xl font-semibold text-gray-900">10ms</p>
            </div>
          </div>
        </div>
      </div>

      {/* Backbone Nodes */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Backbone Nodes</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {backboneNodes.map((node) => (
            <div
              key={node.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedNode?.id === node.id ? 'ring-2 ring-primary-500 border-primary-500' : 'border-gray-200'
              }`}
              onClick={() => setSelectedNode(node)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getNodeTypeColor(node.type)}`}></div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{node.name}</h4>
                    <p className="text-xs text-gray-500">{node.id}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(node.status)}`}>
                  {node.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Location</span>
                  <span className="text-gray-900">{node.location}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Capacity</span>
                  <span className="text-gray-900">{node.capacity}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Utilization</span>
                  <span className={`font-medium ${getUtilizationColor(node.utilization)}`}>
                    {node.utilization}%
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Connections</span>
                  <span className="text-gray-900">{node.connections}</span>
                </div>
              </div>

              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      node.utilization > 80 ? 'bg-red-500' :
                      node.utilization > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${node.utilization}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backbone Connections */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Backbone Connections</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Connection
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bandwidth
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Latency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilization
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {backboneConnections.map((connection) => (
                <tr key={connection.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{connection.id}</div>
                    <div className="text-sm text-gray-500">
                      {connection.from} → {connection.to}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 capitalize">
                      {connection.type.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{connection.bandwidth}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(connection.status)}`}>
                      {connection.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{connection.latency}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 mr-2">
                        {connection.utilization}%
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            connection.utilization > 80 ? 'bg-red-500' :
                            connection.utilization > 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${connection.utilization}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Node Details */}
      {selectedNode && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Node Details - {selectedNode.name}</h3>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Basic Information</label>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Node ID</span>
                    <span className="text-sm font-medium text-gray-900">{selectedNode.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Location</span>
                    <span className="text-sm font-medium text-gray-900">{selectedNode.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Type</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{selectedNode.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedNode.status)}`}>
                      {selectedNode.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Performance Metrics</label>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Capacity</span>
                    <span className="text-sm font-medium text-gray-900">{selectedNode.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Utilization</span>
                    <span className={`text-sm font-medium ${getUtilizationColor(selectedNode.utilization)}`}>
                      {selectedNode.utilization}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Connections</span>
                    <span className="text-sm font-medium text-gray-900">{selectedNode.connections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Update</span>
                    <span className="text-sm font-medium text-gray-900">{selectedNode.lastUpdate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button className="btn-primary">Configure Node</button>
            <button className="btn-secondary">View Connections</button>
            <button className="btn-secondary">Test Performance</button>
            <button className="btn-secondary">Schedule Maintenance</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Backbone;
