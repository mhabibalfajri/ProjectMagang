import React, { useState } from 'react';
import { useSNMP } from '../../hooks/useSNMP';
import SNMPRealTimeTest from './SNMPRealTimeTest';

const SNMPDiscovery = ({ onDiscoveryComplete }) => {
  const [startHosts, setStartHosts] = useState('');
  const [community, setCommunity] = useState('public');
  const [discoveryProgress, setDiscoveryProgress] = useState(0);
  const [showRealTimeTest, setShowRealTimeTest] = useState(false);
  
  const {
    isLoading,
    error,
    devices,
    connections,
    discoveryStatus,
    discoverTopology,
    testConnection,
    addDevice
  } = useSNMP();

  const handleStartDiscovery = async () => {
    if (!startHosts.trim()) {
      alert('Please enter at least one host IP address');
      return;
    }

    const hosts = startHosts.split(',').map(host => host.trim()).filter(host => host);
    
    // Simulate progress updates
    setDiscoveryProgress(0);
    const progressInterval = setInterval(() => {
      setDiscoveryProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 1000);

    try {
      const result = await discoverTopology(hosts, community);
      
      if (result.success) {
        setDiscoveryProgress(100);
        setTimeout(() => {
          onDiscoveryComplete?.(result.data);
        }, 500);
      }
    } catch (err) {
      console.error('Discovery failed:', err);
    } finally {
      clearInterval(progressInterval);
    }
  };

  const handleTestConnection = async () => {
    if (!startHosts.trim()) {
      alert('Please enter a host IP address to test');
      return;
    }

    const host = startHosts.split(',')[0].trim();
    const result = await testConnection(host, community);
    
    if (result.success) {
      alert(`Connection successful!\nDevice: ${result.data.name}\nDescription: ${result.data.description}`);
    } else {
      alert(`Connection failed: ${result.error}`);
    }
  };

  const getStatusColor = () => {
    switch (discoveryStatus) {
      case 'discovering': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (discoveryStatus) {
      case 'discovering': return 'Discovering network...';
      case 'completed': return 'Discovery completed';
      case 'error': return 'Discovery failed';
      default: return 'Ready to discover';
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Test Toggle */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">SNMP Real-time Testing</h3>
            <p className="text-sm text-gray-500">Test koneksi SNMP langsung ke switch</p>
          </div>
          <button
            onClick={() => setShowRealTimeTest(!showRealTimeTest)}
            className="btn-secondary"
          >
            {showRealTimeTest ? 'Hide' : 'Show'} Real-time Test
          </button>
        </div>
      </div>

      {/* Real-time Test Component */}
      {showRealTimeTest && <SNMPRealTimeTest />}

      {/* Discovery Configuration */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">SNMP Network Discovery</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Hosts (IP addresses, comma-separated)
            </label>
            <input
              type="text"
              value={startHosts}
              onChange={(e) => setStartHosts(e.target.value)}
              placeholder="192.168.1.1, 192.168.1.2, 10.0.0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter one or more IP addresses to start the network discovery process
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SNMP Community String
            </label>
            <input
              type="text"
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              placeholder="public"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">
              SNMP community string for authentication (default: public)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleTestConnection}
              disabled={isLoading}
              className="btn-secondary"
            >
              Test Connection
            </button>
            <button
              onClick={handleStartDiscovery}
              disabled={isLoading || !startHosts.trim()}
              className="btn-primary"
            >
              {isLoading ? 'Discovering...' : 'Start Discovery'}
            </button>
          </div>
        </div>
      </div>

      {/* Discovery Status */}
      {isLoading && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Discovery Progress</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </span>
              <span className="text-sm text-gray-500">
                {discoveryProgress}%
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${discoveryProgress}%` }}
              ></div>
            </div>

            {discoveryStatus === 'discovering' && (
              <div className="text-sm text-gray-600">
                <p>• Scanning network devices...</p>
                <p>• Discovering LLDP/CDP neighbors...</p>
                <p>• Mapping network topology...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Discovery Results */}
      {discoveryStatus === 'completed' && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Discovery Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">Devices Found</p>
                  <p className="text-2xl font-bold text-green-900">{devices.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-800">Connections Found</p>
                  <p className="text-2xl font-bold text-blue-900">{connections.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Device List */}
          {devices.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Discovered Devices</h4>
              <div className="space-y-2">
                {devices.map((device, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{device.name || device.host}</p>
                      <p className="text-xs text-gray-500">{device.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {device.interfaces?.length || 0} ports
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {device.lldpNeighbors?.length || 0} LLDP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="card">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Discovery Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SNMPDiscovery;
