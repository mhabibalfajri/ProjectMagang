import { useState, useEffect, useCallback } from 'react';
import snmpService from '../services/snmpService';

export const useSNMP = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState([]);
  const [connections, setConnections] = useState([]);
  const [discoveryStatus, setDiscoveryStatus] = useState('idle'); // idle, discovering, completed, error

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

  // Auto-discovery network topology
  const discoverTopology = useCallback(async (startHosts, community = 'public') => {
    setIsLoading(true);
    setError(null);
    setDiscoveryStatus('discovering');

    try {
      const result = await snmpService.discoverTopology(startHosts, community);
      
      setDevices(result.devices);
      setConnections(result.connections);
      setDiscoveryStatus('completed');
      
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

  // Clear semua data
  const clearData = useCallback(() => {
    setDevices([]);
    setConnections([]);
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
    clearData
  };
};
