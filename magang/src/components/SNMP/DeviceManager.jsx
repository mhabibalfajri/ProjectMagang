import React, { useState } from 'react';
import { useSNMP } from '../../hooks/useSNMP';

const DeviceManager = ({ devices, onDeviceUpdate, onDeviceRemove }) => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDevice, setNewDevice] = useState({ host: '', community: 'public' });
  
  const { isLoading, addDevice, refreshDevice, removeDevice } = useSNMP();

  const handleAddDevice = async (e) => {
    e.preventDefault();
    
    const result = await addDevice(newDevice.host, newDevice.community);
    
    if (result.success) {
      onDeviceUpdate?.(result.data);
      setNewDevice({ host: '', community: 'public' });
      setShowAddForm(false);
    } else {
      alert(`Failed to add device: ${result.error}`);
    }
  };

  const handleRefreshDevice = async (device) => {
    const result = await refreshDevice(device.host, device.community || 'public');
    
    if (result.success) {
      onDeviceUpdate?.(result.data);
    } else {
      alert(`Failed to refresh device: ${result.error}`);
    }
  };

  const handleRemoveDevice = (device) => {
    if (window.confirm(`Are you sure you want to remove ${device.name || device.host}?`)) {
      removeDevice(device.host);
      onDeviceRemove?.(device);
    }
  };

  const getDeviceStatus = (device) => {
    if (device.status === 'operational') return 'up';
    if (device.status === 'maintenance') return 'maintenance';
    if (device.status === 'error') return 'down';
    return 'unknown';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'up': return 'bg-green-100 text-green-800';
      case 'down': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Device List */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Network Devices</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            Add Device
          </button>
        </div>

        {devices.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No devices</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a network device.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {devices.map((device, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {device.name || device.host}
                      </p>
                      <p className="text-xs text-gray-500">{device.host}</p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">
                        {device.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(getDeviceStatus(device))}`}>
                      {getDeviceStatus(device)}
                    </span>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setSelectedDevice(device)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="View Details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleRefreshDevice(device)}
                        disabled={isLoading}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Refresh"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleRemoveDevice(device)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Device Stats */}
                <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                  <span>{device.interfaces?.length || 0} interfaces</span>
                  <span>{device.lldpNeighbors?.length || 0} LLDP neighbors</span>
                  <span>{device.cdpNeighbors?.length || 0} CDP neighbors</span>
                  <span>Uptime: {device.upTime || 'Unknown'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Device Form */}
      {showAddForm && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Device</h3>
          
          <form onSubmit={handleAddDevice} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Host IP Address
              </label>
              <input
                type="text"
                value={newDevice.host}
                onChange={(e) => setNewDevice({ ...newDevice, host: e.target.value })}
                placeholder="192.168.1.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SNMP Community
              </label>
              <input
                type="text"
                value={newDevice.community}
                onChange={(e) => setNewDevice({ ...newDevice, community: e.target.value })}
                placeholder="public"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? 'Adding...' : 'Add Device'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Device Details Modal */}
      {selectedDevice && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Device Details</h3>
              <button
                onClick={() => setSelectedDevice(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDevice.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Host</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDevice.host}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDevice.description || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDevice.location || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDevice.contact || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Uptime</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDevice.upTime || 'N/A'}</p>
                </div>
              </div>
              
              {/* Interfaces */}
              {selectedDevice.interfaces && selectedDevice.interfaces.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-2">Interfaces</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedDevice.interfaces.map((iface, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{iface.description}</p>
                          <p className="text-xs text-gray-500">Index: {iface.index}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            iface.status === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {iface.status}
                          </span>
                          <span className="text-xs text-gray-500">{iface.bandwidth}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManager;
