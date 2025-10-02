import React, { useState, useEffect } from 'react';
import TopologyVisualization from '../components/NetworkTopology/TopologyVisualization';
import SNMPDiscovery from '../components/SNMP/SNMPDiscovery';
import DeviceManager from '../components/SNMP/DeviceManager';
import { useSNMP } from '../hooks/useSNMP';

const NetworkTopology = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // overview, detailed, maintenance, snmp
  const [showSNMPDiscovery, setShowSNMPDiscovery] = useState(false);
  const [showDeviceManager, setShowDeviceManager] = useState(false);
  
  const { devices, connections, addDevice, removeDevice } = useSNMP();

  // Static network nodes (fallback)
  const staticNodes = [
    { id: 'core-1', name: 'Core Router 1', type: 'core', x: 200, y: 150, status: 'operational' },
    { id: 'core-2', name: 'Core Router 2', type: 'core', x: 400, y: 150, status: 'operational' },
    { id: 'backbone-1', name: 'Backbone Node A', type: 'backbone', x: 100, y: 300, status: 'operational' },
    { id: 'backbone-2', name: 'Backbone Node B', type: 'backbone', x: 300, y: 300, status: 'operational' },
    { id: 'backbone-3', name: 'Backbone Node C', type: 'backbone', x: 500, y: 300, status: 'maintenance' },
    { id: 'edge-1', name: 'Edge Router 1', type: 'edge', x: 50, y: 450, status: 'operational' },
    { id: 'edge-2', name: 'Edge Router 2', type: 'edge', x: 200, y: 450, status: 'operational' },
    { id: 'edge-3', name: 'Edge Router 3', type: 'edge', x: 350, y: 450, status: 'operational' },
    { id: 'edge-4', name: 'Edge Router 4', type: 'edge', x: 500, y: 450, status: 'operational' },
    { id: 'peering-1', name: 'Peering Point 1', type: 'peering', x: 150, y: 50, status: 'operational' },
    { id: 'peering-2', name: 'Peering Point 2', type: 'peering', x: 450, y: 50, status: 'operational' },
  ];

  const staticConnections = [
    { from: 'core-1', to: 'core-2', type: 'fiber', bandwidth: '100G' },
    { from: 'core-1', to: 'backbone-1', type: 'fiber', bandwidth: '40G' },
    { from: 'core-1', to: 'backbone-2', type: 'fiber', bandwidth: '40G' },
    { from: 'core-2', to: 'backbone-2', type: 'fiber', bandwidth: '40G' },
    { from: 'core-2', to: 'backbone-3', type: 'fiber', bandwidth: '40G' },
    { from: 'backbone-1', to: 'edge-1', type: 'fiber', bandwidth: '10G' },
    { from: 'backbone-1', to: 'edge-2', type: 'fiber', bandwidth: '10G' },
    { from: 'backbone-2', to: 'edge-2', type: 'fiber', bandwidth: '10G' },
    { from: 'backbone-2', to: 'edge-3', type: 'fiber', bandwidth: '10G' },
    { from: 'backbone-3', to: 'edge-3', type: 'fiber', bandwidth: '10G' },
    { from: 'backbone-3', to: 'edge-4', type: 'fiber', bandwidth: '10G' },
    { from: 'peering-1', to: 'core-1', type: 'backbone', bandwidth: '100G' },
    { from: 'peering-2', to: 'core-2', type: 'backbone', bandwidth: '100G' },
  ];

  // Convert SNMP devices to visualization nodes
  const convertDevicesToNodes = (snmpDevices) => {
    return snmpDevices.map((device, index) => ({
      id: device.host,
      name: device.name || device.host,
      type: getDeviceType(device.description),
      x: 100 + (index % 4) * 150,
      y: 100 + Math.floor(index / 4) * 150,
      status: getDeviceStatus(device),
      host: device.host,
      description: device.description,
      interfaces: device.interfaces,
      neighbors: device.lldpNeighbors || device.cdpNeighbors || []
    }));
  };

  // Convert SNMP connections to visualization connections
  const convertConnectionsToVisualization = (snmpConnections) => {
    return snmpConnections.map(conn => ({
      from: conn.from,
      to: conn.to,
      type: 'discovered',
      bandwidth: conn.bandwidth || '1G',
      protocol: conn.protocol,
      fromPort: conn.fromPort,
      toPort: conn.toPort
    }));
  };

  // Helper functions
  const getDeviceType = (description) => {
    if (!description) return 'edge';
    const desc = description.toLowerCase();
    if (desc.includes('core') || desc.includes('router')) return 'core';
    if (desc.includes('backbone')) return 'backbone';
    if (desc.includes('switch')) return 'edge';
    if (desc.includes('peering')) return 'peering';
    return 'edge';
  };

  const getDeviceStatus = (device) => {
    if (device.interfaces && device.interfaces.length > 0) {
      const upInterfaces = device.interfaces.filter(iface => iface.status === 'up');
      if (upInterfaces.length === 0) return 'error';
      if (upInterfaces.length < device.interfaces.length) return 'maintenance';
      return 'operational';
    }
    return 'operational';
  };

  // Determine which nodes and connections to display
  const networkNodes = devices.length > 0 ? convertDevicesToNodes(devices) : staticNodes;
  const networkConnections = connections.length > 0 ? convertConnectionsToVisualization(connections) : staticConnections;

  // Handle SNMP discovery completion
  const handleDiscoveryComplete = (discoveryData) => {
    console.log('Discovery completed:', discoveryData);
    setViewMode('overview');
    setShowSNMPDiscovery(false);
  };

  // Handle device updates
  const handleDeviceUpdate = (updatedDevice) => {
    console.log('Device updated:', updatedDevice);
  };

  const handleDeviceRemove = (removedDevice) => {
    console.log('Device removed:', removedDevice);
  };


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Network Topology</h1>
          <p className="mt-1 text-sm text-gray-500">
            Interactive fiber optic network topology visualization
          </p>
        </div>
        
        {/* View Controls */}
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
            Detailed
          </button>
          <button
            onClick={() => setViewMode('maintenance')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              viewMode === 'maintenance'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Maintenance
          </button>
          <button
            onClick={() => setShowSNMPDiscovery(true)}
            className="px-3 py-2 text-sm font-medium rounded-md bg-green-100 text-green-700 hover:bg-green-200"
          >
            SNMP Discovery
          </button>
          <button
            onClick={() => setShowDeviceManager(true)}
            className="px-3 py-2 text-sm font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            Device Manager
          </button>
        </div>
      </div>

      {/* Network Legend */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Network Legend</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-600">Core Router</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
            <span className="text-sm text-gray-600">Backbone Node</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-600 rounded-full"></div>
            <span className="text-sm text-gray-600">Edge Router</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
            <span className="text-sm text-gray-600">Peering Point</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-1 bg-network-fiber"></div>
            <span className="text-sm text-gray-600">Fiber Connection</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-1 bg-network-backbone"></div>
            <span className="text-sm text-gray-600">Backbone Link</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Maintenance</span>
          </div>
        </div>
      </div>

      {/* Network Visualization */}
      <div className="card">
        <div className="h-96">
          <TopologyVisualization
            nodes={networkNodes}
            connections={networkConnections}
            onNodeClick={setSelectedNode}
            selectedNode={selectedNode}
          />
        </div>
      </div>

      {/* Node Details */}
      {selectedNode && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Node Details</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-sm text-gray-900">{selectedNode.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <p className="mt-1 text-sm text-gray-900 capitalize">{selectedNode.type}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                selectedNode.status === 'operational' 
                  ? 'bg-green-100 text-green-800'
                  : selectedNode.status === 'maintenance'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedNode.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Uptime</label>
              <p className="mt-1 text-sm text-gray-900">99.8%</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bandwidth</label>
              <p className="mt-1 text-sm text-gray-900">2.4 Gbps</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Update</label>
              <p className="mt-1 text-sm text-gray-900">2 minutes ago</p>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button className="btn-primary">View Details</button>
            <button className="btn-secondary">Configure</button>
            <button className="btn-secondary">Test Connection</button>
            {selectedNode.host && (
              <button 
                onClick={() => setShowDeviceManager(true)}
                className="btn-secondary"
              >
                Manage Device
              </button>
            )}
          </div>
        </div>
      )}

      {/* SNMP Discovery Modal */}
      {showSNMPDiscovery && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">SNMP Network Discovery</h3>
              <button
                onClick={() => setShowSNMPDiscovery(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SNMPDiscovery onDiscoveryComplete={handleDiscoveryComplete} />
          </div>
        </div>
      )}

      {/* Device Manager Modal */}
      {showDeviceManager && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Device Manager</h3>
              <button
                onClick={() => setShowDeviceManager(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <DeviceManager 
              devices={devices}
              onDeviceUpdate={handleDeviceUpdate}
              onDeviceRemove={handleDeviceRemove}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkTopology;
