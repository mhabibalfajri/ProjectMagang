import React, { useState } from 'react';

const Devices = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [filter, setFilter] = useState('all');

  const devices = [
    {
      id: 'DEV-001',
      name: 'Cisco ASR 9000',
      type: 'router',
      model: 'ASR-9006',
      location: 'Data Center Alpha',
      status: 'operational',
      ipAddress: '192.168.1.1',
      firmware: '7.3.2',
      uptime: '99.9%',
      lastMaintenance: '2024-01-10'
    },
    {
      id: 'DEV-002',
      name: 'Juniper MX960',
      type: 'router',
      model: 'MX960',
      location: 'Data Center Beta',
      status: 'operational',
      ipAddress: '192.168.1.2',
      firmware: '21.4R3',
      uptime: '99.8%',
      lastMaintenance: '2024-01-08'
    },
    {
      id: 'DEV-003',
      name: 'Cisco Catalyst 9500',
      type: 'switch',
      model: 'C9500-48Y4C',
      location: 'Metro Hub East',
      status: 'maintenance',
      ipAddress: '192.168.1.3',
      firmware: '16.12.07',
      uptime: '99.5%',
      lastMaintenance: '2024-01-15'
    },
    {
      id: 'DEV-004',
      name: 'Aruba 6300M',
      type: 'switch',
      model: 'JL354A',
      location: 'Metro Hub West',
      status: 'operational',
      ipAddress: '192.168.1.4',
      firmware: '10.10.0010',
      uptime: '99.7%',
      lastMaintenance: '2024-01-12'
    },
    {
      id: 'DEV-005',
      name: 'Fortinet FortiGate 6000',
      type: 'firewall',
      model: 'FortiGate-6000F',
      location: 'Data Center Alpha',
      status: 'operational',
      ipAddress: '192.168.1.5',
      firmware: '7.2.5',
      uptime: '99.9%',
      lastMaintenance: '2024-01-09'
    },
    {
      id: 'DEV-006',
      name: 'Palo Alto PA-5450',
      type: 'firewall',
      model: 'PA-5450',
      location: 'Data Center Beta',
      status: 'operational',
      ipAddress: '192.168.1.6',
      firmware: '10.2.3',
      uptime: '99.8%',
      lastMaintenance: '2024-01-11'
    }
  ];

  const filteredDevices = devices.filter(device => {
    if (filter === 'all') return true;
    return device.status === filter;
  });

  const getDeviceTypeIcon = (type) => {
    switch (type) {
      case 'router':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        );
      case 'switch':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'firewall':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        );
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

  const getTypeColor = (type) => {
    switch (type) {
      case 'router': return 'bg-blue-100 text-blue-600';
      case 'switch': return 'bg-green-100 text-green-600';
      case 'firewall': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Network Devices</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor network infrastructure devices
          </p>
        </div>
        <button className="btn-primary">Add Device</button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <div className="flex space-x-2">
            {[
              { value: 'all', label: 'All Devices' },
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

      {/* Devices Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredDevices.map((device) => (
          <div
            key={device.id}
            className={`card cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedDevice?.id === device.id ? 'ring-2 ring-primary-500' : ''
            }`}
            onClick={() => setSelectedDevice(device)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(device.type)}`}>
                  {getDeviceTypeIcon(device.type)}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{device.name}</h3>
                  <p className="text-sm text-gray-500">{device.model}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                {device.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Device ID</span>
                <span className="text-sm font-medium text-gray-900">{device.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Type</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(device.type)}`}>
                  {device.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Location</span>
                <span className="text-sm font-medium text-gray-900">{device.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">IP Address</span>
                <span className="text-sm font-medium text-gray-900">{device.ipAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Firmware</span>
                <span className="text-sm font-medium text-gray-900">{device.firmware}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className="text-sm font-medium text-gray-900">{device.uptime}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Last Maintenance: {device.lastMaintenance}</span>
                <button className="text-primary-600 hover:text-primary-800 font-medium">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Device Details */}
      {selectedDevice && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Device Details - {selectedDevice.name}</h3>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Device Information</label>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Device ID</span>
                    <span className="text-sm font-medium text-gray-900">{selectedDevice.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Name</span>
                    <span className="text-sm font-medium text-gray-900">{selectedDevice.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Model</span>
                    <span className="text-sm font-medium text-gray-900">{selectedDevice.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Type</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedDevice.type)}`}>
                      {selectedDevice.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Location</span>
                    <span className="text-sm font-medium text-gray-900">{selectedDevice.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Network Configuration</label>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">IP Address</span>
                    <span className="text-sm font-medium text-gray-900">{selectedDevice.ipAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Firmware Version</span>
                    <span className="text-sm font-medium text-gray-900">{selectedDevice.firmware}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedDevice.status)}`}>
                      {selectedDevice.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Uptime</span>
                    <span className="text-sm font-medium text-gray-900">{selectedDevice.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Maintenance</span>
                    <span className="text-sm font-medium text-gray-900">{selectedDevice.lastMaintenance}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button className="btn-primary">Configure Device</button>
            <button className="btn-secondary">SSH Access</button>
            <button className="btn-secondary">Update Firmware</button>
            <button className="btn-secondary">Schedule Maintenance</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Devices;
