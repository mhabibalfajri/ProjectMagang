import React, { useState, useEffect } from 'react';
import { supabase, dbService } from '../config/supabase.js';

const DatabaseStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkDatabaseConnection = async () => {
    setIsLoading(true);
    setError(null);
    setConnectionStatus('checking');

    try {
      // Test basic connection
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .limit(1);

      if (error && error.code === 'PGRST116') {
        setConnectionStatus('connected-no-tables');
        setError('Database connected but tables do not exist. Please run the setup script.');
      } else if (error) {
        setConnectionStatus('error');
        setError(error.message);
      } else {
        setConnectionStatus('connected');
        setError(null);
      }

      // Check which tables exist
      const tableNames = ['devices', 'interfaces', 'connections', 'discovery_sessions', 'network_topology', 'snmp_data'];
      const existingTables = [];

      for (const tableName of tableNames) {
        try {
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);

          if (!error || error.code !== 'PGRST116') {
            existingTables.push({
              name: tableName,
              exists: true,
              recordCount: data ? data.length : 0
            });
          } else {
            existingTables.push({
              name: tableName,
              exists: false,
              recordCount: 0
            });
          }
        } catch (err) {
          existingTables.push({
            name: tableName,
            exists: false,
            recordCount: 0,
            error: err.message
          });
        }
      }

      setTables(existingTables);

    } catch (err) {
      setConnectionStatus('error');
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testDataInsertion = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const testDevice = {
        host: '192.168.1.100',
        name: 'Test-Device',
        description: 'Test device for database verification',
        device_type: 'switch',
        vendor: 'Test Vendor',
        model: 'Test Model',
        status: 'active'
      };

      const { data, error } = await dbService.createDevice(testDevice);

      if (error) {
        setError(`Insert test failed: ${error.message}`);
      } else {
        setError(null);
        alert(`✅ Test device created successfully with ID: ${data.id}`);
        
        // Clean up test device
        await dbService.deleteDevice(data.id);
        alert('🧹 Test device cleaned up');
      }
    } catch (err) {
      setError(`Insert test failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'connected-no-tables': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return '✅ Connected';
      case 'connected-no-tables': return '⚠️ Connected (No Tables)';
      case 'error': return '❌ Connection Error';
      default: return '🔄 Checking...';
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Database Status</h3>
      
      <div className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          <button
            onClick={checkDatabaseConnection}
            disabled={isLoading}
            className="btn-secondary text-sm"
          >
            {isLoading ? 'Checking...' : 'Refresh'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Tables Status */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Database Tables</h4>
          <div className="space-y-1">
            {tables.map((table, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="font-mono">{table.name}</span>
                <div className="flex items-center space-x-2">
                  {table.exists ? (
                    <>
                      <span className="text-green-600">✅</span>
                      <span className="text-gray-500">({table.recordCount} records)</span>
                    </>
                  ) : (
                    <>
                      <span className="text-red-600">❌</span>
                      <span className="text-gray-500">Not found</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Actions */}
        {connectionStatus === 'connected' && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Test Actions</h4>
            <button
              onClick={testDataInsertion}
              disabled={isLoading}
              className="btn-primary text-sm"
            >
              {isLoading ? 'Testing...' : 'Test Data Insertion'}
            </button>
          </div>
        )}

        {/* Setup Instructions */}
        {connectionStatus === 'connected-no-tables' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Setup Required</h4>
            <p className="text-sm text-yellow-700 mb-3">
              Database is connected but tables don't exist. Please follow these steps:
            </p>
            <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
              <li>Go to your Supabase dashboard</li>
              <li>Navigate to SQL Editor</li>
              <li>Run the SQL commands from <code className="bg-yellow-100 px-1 rounded">database/schema.sql</code></li>
              <li>Or follow the instructions in <code className="bg-yellow-100 px-1 rounded">SUPABASE_SETUP.md</code></li>
            </ol>
          </div>
        )}

        {/* Connection Info */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Connection Info</h4>
          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>URL:</strong> https://feoyvuyklhtwrljxweht.supabase.co</p>
            <p><strong>Status:</strong> {connectionStatus}</p>
            <p><strong>Tables Found:</strong> {tables.filter(t => t.exists).length}/{tables.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseStatus;
