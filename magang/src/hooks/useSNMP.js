import { useState, useEffect, useCallback } from 'react';
import snmpService from '../services/snmpService';

export const useSNMP = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState([]);
  const [connections, setConnections] = useState([]);
  const [discoveryStatus, setDiscoveryStatus] = useState('idle'); // idle, discovering, completed, error
  const [discoverySessions, setDiscoverySessions] = useState([]);
  const [networkTopology, setNetworkTopology] = useState(null);

  // Test koneksi ke device
  const testConnection = useCallback(async (host, community = 'public') => {
    setIsLoading(true);
    setError(null);

    try {
      const systemInfo = await snmpService.getSystemInfo(host, community);
      return { success: true, data: systemInfo };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mendapatkan informasi interface dari device
  const getInterfaces = useCallback(async (host, community = 'public') => {
    setIsLoading(true);
    setError(null);

    try {
      const interfaces = await snmpService.getInterfaceInfo(host, community);
      return { success: true, data: interfaces };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mendapatkan neighbors dari device
  const getNeighbors = useCallback(async (host, community = 'public') => {
    setIsLoading(true);
    setError(null);

    try {
      const [lldpNeighbors, cdpNeighbors] = await Promise.allSettled([
        snmpService.getLLDPNeighbors(host, community),
        snmpService.getCDPNeighbors(host, community)
      ]);

      const neighbors = {
        lldp: lldpNeighbors.status === 'fulfilled' ? lldpNeighbors.value : [],
        cdp: cdpNeighbors.status === 'fulfilled' ? cdpNeighbors.value : []
      };

      return { success: true, data: neighbors };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-discovery network topology with database integration
  const discoverTopology = useCallback(async (startHosts, community = 'public') => {
    setIsLoading(true);
    setError(null);
    setDiscoveryStatus('discovering');

    try {
      const result = await snmpService.discoverTopology(startHosts, community);
      
      setDevices(result.devices);
      setConnections(result.connections);
      setDiscoveryStatus('completed');
      
      // Refresh discovery sessions from database
      await loadDiscoverySessions();
      
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      setDiscoveryStatus('error');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh data dari device yang sudah ada
  const refreshDevice = useCallback(async (host, community = 'public') => {
    setIsLoading(true);
    setError(null);

    try {
      const [systemInfo, interfaces, neighbors] = await Promise.all([
        snmpService.getSystemInfo(host, community),
        snmpService.getInterfaceInfo(host, community),
        getNeighbors(host, community)
      ]);

      const updatedDevice = {
        ...systemInfo,
        interfaces,
        neighbors: neighbors.success ? neighbors.data : { lldp: [], cdp: [] },
        lastUpdated: new Date().toISOString()
      };

      setDevices(prev => 
        prev.map(device => 
          device.host === host ? updatedDevice : device
        )
      );

      return { success: true, data: updatedDevice };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [getNeighbors]);

  // Menambahkan device baru
  const addDevice = useCallback(async (host, community = 'public') => {
    const result = await testConnection(host, community);
    
    if (result.success) {
      setDevices(prev => {
        const exists = prev.find(device => device.host === host);
        if (exists) {
          return prev.map(device => 
            device.host === host ? { ...device, ...result.data } : device
          );
        }
        return [...prev, result.data];
      });
    }

    return result;
  }, [testConnection]);

  // Menghapus device
  const removeDevice = useCallback((host) => {
    setDevices(prev => prev.filter(device => device.host !== host));
    setConnections(prev => prev.filter(conn => 
      conn.from !== host && conn.to !== host
    ));
  }, []);

  // Menambahkan koneksi manual
  const addConnection = useCallback((connection) => {
    setConnections(prev => {
      const exists = prev.find(conn => 
        conn.from === connection.from && 
        conn.to === connection.to &&
        conn.fromPort === connection.fromPort &&
        conn.toPort === connection.toPort
      );
      
      if (!exists) {
        return [...prev, { ...connection, id: Date.now() }];
      }
      return prev;
    });
  }, []);

  // Menghapus koneksi
  const removeConnection = useCallback((connectionId) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
  }, []);

  // Load data from database
  const loadDevicesFromDatabase = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const dbDevices = await snmpService.loadDevicesFromDatabase();
      setDevices(dbDevices);
      return { success: true, data: dbDevices };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadConnectionsFromDatabase = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const dbConnections = await snmpService.loadConnectionsFromDatabase();
      setConnections(dbConnections);
      return { success: true, data: dbConnections };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadDiscoverySessions = useCallback(async () => {
    try {
      const sessions = await snmpService.loadDiscoverySessionsFromDatabase();
      setDiscoverySessions(sessions);
      return { success: true, data: sessions };
    } catch (err) {
      console.error('Failed to load discovery sessions:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const loadNetworkTopology = useCallback(async () => {
    try {
      const topology = await snmpService.loadNetworkTopologyFromDatabase();
      setNetworkTopology(topology);
      return { success: true, data: topology };
    } catch (err) {
      console.error('Failed to load network topology:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Save device to database
  const saveDeviceToDatabase = useCallback(async (deviceData) => {
    setIsLoading(true);
    setError(null);

    try {
      const device = await snmpService.saveDeviceToDatabase(deviceData);
      setDevices(prev => [...prev, device]);
      return { success: true, data: device };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update device in database
  const updateDeviceInDatabase = useCallback(async (deviceId, updates) => {
    setIsLoading(true);
    setError(null);

    try {
      const device = await snmpService.updateDeviceInDatabase(deviceId, updates);
      setDevices(prev => prev.map(d => d.id === deviceId ? device : d));
      return { success: true, data: device };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete device from database
  const deleteDeviceFromDatabase = useCallback(async (deviceId) => {
    setIsLoading(true);
    setError(null);

    try {
      await snmpService.deleteDeviceFromDatabase(deviceId);
      setDevices(prev => prev.filter(d => d.id !== deviceId));
      setConnections(prev => prev.filter(c => c.from_host !== deviceId && c.to_host !== deviceId));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load all data from database on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          loadDevicesFromDatabase(),
          loadConnectionsFromDatabase(),
          loadDiscoverySessions(),
          loadNetworkTopology()
        ]);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    };

    loadInitialData();
  }, [loadDevicesFromDatabase, loadConnectionsFromDatabase, loadDiscoverySessions, loadNetworkTopology]);

  // Clear semua data
  const clearData = useCallback(() => {
    setDevices([]);
    setConnections([]);
    setDiscoverySessions([]);
    setNetworkTopology(null);
    setError(null);
    setDiscoveryStatus('idle');
  }, []);

  // Cleanup saat component unmount
  useEffect(() => {
    return () => {
      snmpService.closeAllSessions();
    };
  }, []);

  return {
    // State
    isLoading,
    error,
    devices,
    connections,
    discoveryStatus,
    discoverySessions,
    networkTopology,
    
    // Actions
    testConnection,
    getInterfaces,
    getNeighbors,
    discoverTopology,
    refreshDevice,
    addDevice,
    removeDevice,
    addConnection,
    removeConnection,
    clearData,
    
    // Database operations
    loadDevicesFromDatabase,
    loadConnectionsFromDatabase,
    loadDiscoverySessions,
    loadNetworkTopology,
    saveDeviceToDatabase,
    updateDeviceInDatabase,
    deleteDeviceFromDatabase
  };
};
