import React, { useState, useEffect } from 'react';

const SNMPRealTimeTest = () => {
  const [host, setHost] = useState('192.168.1.1');
  const [community, setCommunity] = useState('public');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [systemInfo, setSystemInfo] = useState(null);
  const [interfaces, setInterfaces] = useState([]);
  const [wsConnection, setWsConnection] = useState(null);
  const [monitoringData, setMonitoringData] = useState(null);

  // Test SNMP connection
  const testConnection = async () => {
    setIsLoading(true);
    setError(null);
    setSystemInfo(null);

    try {
      console.log(`🧪 Testing SNMP connection to ${host}...`);
      
      const response = await fetch('http://localhost:3001/api/snmp/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host,
          community,
          version: 2
        })
      });

      const result = await response.json();

      if (result.success) {
        setIsConnected(true);
        setSystemInfo(result);
        console.log('✅ SNMP connection successful:', result);
      } else {
        setError(result.error);
        setIsConnected(false);
        console.error('❌ SNMP connection failed:', result.error);
      }
    } catch (err) {
      setError(`Connection failed: ${err.message}`);
      setIsConnected(false);
      console.error('❌ SNMP test error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get system information
  const getSystemInfo = async () => {
    if (!isConnected) return;

    try {
      console.log(`🔍 Getting system info from ${host}...`);
      
      const response = await fetch('http://localhost:3001/api/snmp/system-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host,
          community,
          version: 2
        })
      });

      const result = await response.json();
      setSystemInfo(result);
      console.log('✅ System info retrieved:', result);
    } catch (err) {
      console.error('❌ Failed to get system info:', err);
      setError(`Failed to get system info: ${err.message}`);
    }
  };

  // Get interfaces
  const getInterfaces = async () => {
    if (!isConnected) return;

    try {
      console.log(`🔍 Getting interfaces from ${host}...`);
      
      const response = await fetch('http://localhost:3001/api/snmp/interfaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host,
          community,
          version: 2
        })
      });

      const result = await response.json();
      setInterfaces(result.interfaces || []);
      console.log(`✅ Retrieved ${result.interfaces?.length || 0} interfaces`);
    } catch (err) {
      console.error('❌ Failed to get interfaces:', err);
      setError(`Failed to get interfaces: ${err.message}`);
    }
  };

  // Start real-time monitoring
  const startMonitoring = () => {
    if (wsConnection) {
      wsConnection.close();
    }

    try {
      const ws = new WebSocket('ws://localhost:3001');
      
      ws.onopen = () => {
        console.log('🔌 WebSocket connected');
        setWsConnection(ws);
        
        // Start monitoring
        ws.send(JSON.stringify({
          type: 'start_monitoring',
          host,
          community,
          version: 2,
          interval: 5000
        }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('📊 Received monitoring data:', data);
        
        if (data.type === 'monitoring_data') {
          setMonitoringData(data.data);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setError('WebSocket connection error');
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setWsConnection(null);
        setMonitoringData(null);
      };
    } catch (err) {
      console.error('❌ Failed to start monitoring:', err);
      setError(`Failed to start monitoring: ${err.message}`);
    }
  };

  // Stop monitoring
  const stopMonitoring = () => {
    if (wsConnection) {
      wsConnection.send(JSON.stringify({
        type: 'stop_monitoring',
        host
      }));
      wsConnection.close();
      setWsConnection(null);
      setMonitoringData(null);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, [wsConnection]);

  return (
    <div className="space-y-6">
      {/* Connection Test */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">SNMP Real-time Test</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Host IP Address
              </label>
              <input
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="192.168.1.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SNMP Community
              </label>
              <input
                type="text"
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                placeholder="public"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={testConnection}
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </button>
            
            {isConnected && (
              <>
                <button
                  onClick={getSystemInfo}
                  className="btn-secondary"
                >
                  Get System Info
                </button>
                
                <button
                  onClick={getInterfaces}
                  className="btn-secondary"
                >
                  Get Interfaces
                </button>
              </>
            )}
          </div>

          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* System Information */}
      {systemInfo && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Host</label>
              <p className="text-sm text-gray-900">{systemInfo.host}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-sm text-gray-900">{systemInfo.sysName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-sm text-gray-900">{systemInfo.sysDescr}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Uptime</label>
              <p className="text-sm text-gray-900">{systemInfo.sysUpTime}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Contact</label>
              <p className="text-sm text-gray-900">{systemInfo.sysContact}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Location</label>
              <p className="text-sm text-gray-900">{systemInfo.sysLocation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Interfaces */}
      {interfaces.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Interfaces ({interfaces.length})
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Index
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Speed
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {interfaces.map((iface, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {iface.index}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {iface.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {iface.description || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        iface.status === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {iface.status || 'unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {iface.bandwidth || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Real-time Monitoring */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Real-time Monitoring</h3>
        
        <div className="space-y-4">
          <div className="flex space-x-3">
            {!wsConnection ? (
              <button
                onClick={startMonitoring}
                disabled={!isConnected}
                className="btn-primary"
              >
                Start Monitoring
              </button>
            ) : (
              <button
                onClick={stopMonitoring}
                className="btn-secondary"
              >
                Stop Monitoring
              </button>
            )}
          </div>

          {wsConnection && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">Monitoring Active</span>
            </div>
          )}

          {monitoringData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Latest Data</h4>
              <div className="space-y-1">
                <p className="text-sm text-blue-700">
                  <strong>Uptime:</strong> {monitoringData.sysUpTime}
                </p>
                <p className="text-sm text-blue-700">
                  <strong>Timestamp:</strong> {new Date(monitoringData.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SNMPRealTimeTest;
