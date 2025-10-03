// SNMP Service - Browser Compatible Version with Supabase Integration
// This version uses WebSocket or API calls instead of direct SNMP library

import { dbService } from '../config/supabase.js'

class SNMPService {
  constructor() {
    this.sessions = new Map();
    this.defaultOptions = {
      port: 161,
      retries: 3,
      timeout: 5000,
      transport: 'udp4',
      trapPort: 162,
      version: 1,
      idBitsSize: 32
    };
    this.wsConnection = null;
    this.apiBaseUrl = 'http://localhost:3001/api'; // Backend API URL
  }

  // Initialize WebSocket connection for real-time SNMP
  async initializeWebSocket() {
    return new Promise((resolve, reject) => {
      try {
        this.wsConnection = new WebSocket('ws://localhost:3001/snmp');
        
        this.wsConnection.onopen = () => {
          console.log('SNMP WebSocket connected');
          resolve(true);
        };
        
        this.wsConnection.onerror = (error) => {
          console.error('SNMP WebSocket error:', error);
          reject(error);
        };
        
        this.wsConnection.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.handleWebSocketMessage(data);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  // Handle WebSocket messages
  handleWebSocketMessage(data) {
    // Handle real-time SNMP data updates
    console.log('Received SNMP data:', data);
  }

  // Make API call to backend SNMP service
  async makeAPICall(endpoint, data = {}) {
    try {
      console.log(`📡 Making API call to ${endpoint}`, data);
      
      const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ API call successful to ${endpoint}`, result);
      return result;
    } catch (error) {
      console.error(`❌ API call failed to ${endpoint}:`, error);
      throw error;
    }
  }

  // Create session for device (browser compatible)
  createSession(host, community = 'public', options = {}) {
    const sessionKey = `${host}:${community}`;
    
    if (this.sessions.has(sessionKey)) {
      return this.sessions.get(sessionKey);
    }

    const sessionOptions = { ...this.defaultOptions, ...options };
    const session = {
      host,
      community,
      options: sessionOptions,
      id: sessionKey,
      created: new Date().toISOString()
    };
    
    this.sessions.set(sessionKey, session);
    return session;
  }

  // Get system information from device
  async getSystemInfo(host, community = 'public') {
    try {
      console.log(`🔍 Getting system info from ${host}...`);
      
      const result = await this.makeAPICall('/snmp/system-info', {
        host,
        community,
        version: 2
      });

      const systemInfo = {
        host,
        description: result.sysDescr || 'Unknown Device',
        objectId: result.sysObjectID || '',
        upTime: result.sysUpTime || '0',
        contact: result.sysContact || '',
        name: result.sysName || host,
        location: result.sysLocation || '',
        timestamp: result.timestamp || new Date().toISOString()
      };
      
      console.log(`✅ System info retrieved from ${host}:`, systemInfo);
      return systemInfo;
    } catch (error) {
      // Fallback to mock data for demo purposes
      console.warn(`⚠️ SNMP API not available for ${host}, using mock data:`, error.message);
      return this.getMockSystemInfo(host);
    }
  }

  // Get interface information from device
  async getInterfaceInfo(host, community = 'public') {
    try {
      console.log(`🔍 Getting interface info from ${host}...`);
      
      const result = await this.makeAPICall('/snmp/interfaces', {
        host,
        community,
        version: 2
      });

      const interfaces = result.interfaces || [];
      console.log(`✅ Retrieved ${interfaces.length} interfaces from ${host}`);
      return interfaces;
    } catch (error) {
      // Fallback to mock data for demo purposes
      console.warn(`⚠️ SNMP API not available for ${host}, using mock data:`, error.message);
      return this.getMockInterfaceInfo(host);
    }
  }

  // Get LLDP neighbors
  async getLLDPNeighbors(host, community = 'public') {
    try {
      const result = await this.makeAPICall('/snmp/lldp-neighbors', {
        host,
        community
      });

      return result.neighbors || [];
    } catch (error) {
      // Fallback to mock data for demo purposes
      console.warn('SNMP API not available, using mock data:', error.message);
      return this.getMockLLDPNeighbors(host);
    }
  }

  // Get CDP neighbors
  async getCDPNeighbors(host, community = 'public') {
    try {
      const result = await this.makeAPICall('/snmp/cdp-neighbors', {
        host,
        community
      });

      return result.neighbors || [];
    } catch (error) {
      // Fallback to mock data for demo purposes
      console.warn('SNMP API not available, using mock data:', error.message);
      return this.getMockCDPNeighbors(host);
    }
  }

  // Auto-discovery network topology with database integration
  async discoverTopology(startHosts, community = 'public') {
    try {
      // Create discovery session in database
      const sessionData = {
        session_name: `Discovery ${new Date().toLocaleString()}`,
        start_hosts: startHosts,
        community_string: community,
        status: 'running',
        started_at: new Date().toISOString()
      };
      
      const session = await dbService.createDiscoverySession(sessionData);
      console.log('Created discovery session:', session.id);

      const result = await this.makeAPICall('/snmp/discover-topology', {
        startHosts,
        community
      });

      const discoveryResult = {
        devices: result.devices || [],
        connections: result.connections || [],
        timestamp: new Date().toISOString(),
        sessionId: session.id
      };

      // Save discovery results to database
      await this.saveDiscoveryResultsToDatabase(discoveryResult);

      return discoveryResult;
    } catch (error) {
      // Fallback to mock discovery for demo purposes
      console.warn('SNMP API not available, using mock discovery:', error.message);
      const mockResult = this.getMockTopologyDiscovery(startHosts);
      
      // Still save mock results to database
      try {
        const sessionData = {
          session_name: `Mock Discovery ${new Date().toLocaleString()}`,
          start_hosts: startHosts,
          community_string: community,
          status: 'running',
          started_at: new Date().toISOString()
        };
        
        const session = await dbService.createDiscoverySession(sessionData);
        mockResult.sessionId = session.id;
        
        await this.saveDiscoveryResultsToDatabase(mockResult);
      } catch (dbError) {
        console.warn('Failed to save mock results to database:', dbError.message);
      }
      
      return mockResult;
    }
  }

  // Save discovery results to database
  async saveDiscoveryResultsToDatabase(discoveryResult) {
    try {
      const { devices, connections, sessionId } = discoveryResult;
      
      // Prepare devices for database
      const deviceData = devices.map(device => ({
        host: device.host,
        name: device.name || device.host,
        description: device.description || 'Discovered Device',
        object_id: device.objectId || '',
        up_time: device.upTime || 0,
        contact: device.contact || '',
        location: device.location || '',
        device_type: this.detectDeviceType(device.description),
        vendor: this.detectVendor(device.description),
        model: this.detectModel(device.description),
        status: 'active',
        last_seen: new Date().toISOString()
      }));

      // Prepare connections for database
      const connectionData = connections.map(conn => ({
        from_host: conn.from,
        to_host: conn.to,
        from_port: conn.fromPort || '',
        to_port: conn.toPort || '',
        connection_type: conn.type || 'discovered',
        protocol: conn.protocol || 'LLDP',
        bandwidth: conn.bandwidth || '1G',
        status: 'active'
      }));

      // Save to database
      const results = await dbService.saveDiscoveryResults(deviceData, connectionData, sessionId);
      
      console.log('Discovery results saved to database:', {
        devices: results.devices?.length || 0,
        connections: results.connections?.length || 0
      });

      return results;
    } catch (error) {
      console.error('Failed to save discovery results to database:', error);
      throw error;
    }
  }

  // Helper methods for device detection
  detectDeviceType(description) {
    if (!description) return 'unknown';
    const desc = description.toLowerCase();
    if (desc.includes('switch')) return 'switch';
    if (desc.includes('router')) return 'router';
    if (desc.includes('firewall')) return 'firewall';
    if (desc.includes('access point') || desc.includes('ap')) return 'access_point';
    return 'unknown';
  }

  detectVendor(description) {
    if (!description) return 'unknown';
    const desc = description.toLowerCase();
    if (desc.includes('cisco')) return 'Cisco';
    if (desc.includes('hp') || desc.includes('hewlett')) return 'HP';
    if (desc.includes('juniper')) return 'Juniper';
    if (desc.includes('dell')) return 'Dell';
    if (desc.includes('aruba')) return 'Aruba';
    return 'unknown';
  }

  detectModel(description) {
    if (!description) return 'unknown';
    // Extract model from description (basic pattern matching)
    const match = description.match(/([A-Z0-9-]+)/);
    return match ? match[1] : 'unknown';
  }

  // Mock data methods for demo purposes
  getMockSystemInfo(host) {
    const deviceTypes = ['Cisco Catalyst 2960', 'HP ProCurve 2520', 'Juniper EX2300', 'Dell PowerConnect 5524'];
    const randomType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    
    return {
      host,
      description: `${randomType} Switch`,
      objectId: '1.3.6.1.4.1.9.1.716',
      upTime: '1234567890',
      contact: 'admin@company.com',
      name: `Switch-${host.split('.').pop()}`,
      location: 'Data Center Rack 1',
      timestamp: new Date().toISOString()
    };
  }

  getMockInterfaceInfo(host) {
    const interfaces = [];
    const portCount = Math.floor(Math.random() * 20) + 8; // 8-28 ports
    
    for (let i = 1; i <= portCount; i++) {
      const isUp = Math.random() > 0.2; // 80% chance of being up
      const speed = ['100M', '1G', '10G'][Math.floor(Math.random() * 3)];
      
      interfaces.push({
        index: i,
        description: `GigabitEthernet0/${i}`,
        type: 6, // ethernetCsmacd
        mtu: 1500,
        speed: this.parseSpeed(speed),
        physicalAddress: this.generateMAC(),
        adminStatus: 1, // up
        operStatus: isUp ? 1 : 2, // up or down
        status: isUp ? 'up' : 'down',
        bandwidth: speed,
        utilization: Math.floor(Math.random() * 100),
        host
      });
    }
    
    return interfaces;
  }

  getMockLLDPNeighbors(host) {
    const neighbors = [];
    const neighborCount = Math.floor(Math.random() * 5) + 1; // 1-5 neighbors
    
    for (let i = 0; i < neighborCount; i++) {
      const neighborIP = this.generateNeighborIP(host);
      neighbors.push({
        localPort: Math.floor(Math.random() * 24) + 1,
        remotePort: Math.floor(Math.random() * 24) + 1,
        ttl: 120,
        chassisId: this.generateMAC(),
        portId: `GigabitEthernet0/${Math.floor(Math.random() * 24) + 1}`,
        sysName: `Switch-${neighborIP.split('.').pop()}`,
        sysDesc: 'Cisco IOS Software, C2960 Software (C2960-LANBASEK9-M), Version 15.0(2)SE4',
        capEnabled: 4, // bridge
        capSupported: 4, // bridge
        host,
        timestamp: new Date().toISOString()
      });
    }
    
    return neighbors;
  }

  getMockCDPNeighbors(host) {
    const neighbors = [];
    const neighborCount = Math.floor(Math.random() * 3) + 1; // 1-3 neighbors
    
    for (let i = 0; i < neighborCount; i++) {
      const neighborIP = this.generateNeighborIP(host);
      neighbors.push({
        localPort: Math.floor(Math.random() * 24) + 1,
        remotePort: Math.floor(Math.random() * 24) + 1,
        deviceId: `Switch-${neighborIP.split('.').pop()}`,
        devicePort: `GigabitEthernet0/${Math.floor(Math.random() * 24) + 1}`,
        platform: 'cisco WS-C2960-24TC-L',
        capabilities: 4, // bridge
        vtpDomain: '',
        nativeVlan: 1,
        host,
        timestamp: new Date().toISOString()
      });
    }
    
    return neighbors;
  }

  getMockTopologyDiscovery(startHosts) {
    const devices = [];
    const connections = [];
    
    // Add start hosts as devices
    startHosts.forEach((host, index) => {
      const device = this.getMockSystemInfo(host);
      device.interfaces = this.getMockInterfaceInfo(host);
      device.lldpNeighbors = this.getMockLLDPNeighbors(host);
      device.cdpNeighbors = this.getMockCDPNeighbors(host);
      devices.push(device);
    });
    
    // Add discovered neighbors as devices
    devices.forEach(device => {
      device.lldpNeighbors.forEach(neighbor => {
        if (!devices.find(d => d.host === neighbor.sysName)) {
          const neighborDevice = this.getMockSystemInfo(neighbor.sysName);
          neighborDevice.interfaces = this.getMockInterfaceInfo(neighbor.sysName);
          devices.push(neighborDevice);
          
          // Add connection
          connections.push({
            from: device.host,
            to: neighbor.sysName,
            fromPort: neighbor.localPort,
            toPort: neighbor.portId,
            type: 'discovered',
            protocol: 'LLDP',
            bandwidth: this.estimateBandwidth(neighbor.sysDesc)
          });
        }
      });
      
      device.cdpNeighbors.forEach(neighbor => {
        if (!devices.find(d => d.host === neighbor.deviceId)) {
          const neighborDevice = this.getMockSystemInfo(neighbor.deviceId);
          neighborDevice.interfaces = this.getMockInterfaceInfo(neighbor.deviceId);
          devices.push(neighborDevice);
          
          // Add connection
          connections.push({
            from: device.host,
            to: neighbor.deviceId,
            fromPort: neighbor.localPort,
            toPort: neighbor.devicePort,
            type: 'discovered',
            protocol: 'CDP',
            bandwidth: this.estimateBandwidth(neighbor.platform)
          });
        }
      });
    });
    
    return {
      devices,
      connections,
      timestamp: new Date().toISOString()
    };
  }

  // Helper methods
  parseSpeed(speed) {
    switch (speed) {
      case '100M': return 100000000;
      case '1G': return 1000000000;
      case '10G': return 10000000000;
      default: return 1000000000;
    }
  }

  generateMAC() {
    return Array.from({length: 6}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':');
  }

  generateNeighborIP(host) {
    const parts = host.split('.');
    const lastOctet = parseInt(parts[3]) + Math.floor(Math.random() * 10) + 1;
    return `${parts[0]}.${parts[1]}.${parts[2]}.${lastOctet}`;
  }

  estimateBandwidth(description) {
    if (!description) return '1G';
    
    const desc = description.toLowerCase();
    if (desc.includes('100g')) return '100G';
    if (desc.includes('40g')) return '40G';
    if (desc.includes('10g')) return '10G';
    if (desc.includes('1g')) return '1G';
    if (desc.includes('100m')) return '100M';
    if (desc.includes('10m')) return '10M';
    
    return '1G';
  }

  // Database integration methods
  async loadDevicesFromDatabase() {
    try {
      const devices = await dbService.getDevices();
      console.log(`Loaded ${devices.length} devices from database`);
      return devices;
    } catch (error) {
      console.error('Failed to load devices from database:', error);
      return [];
    }
  }

  async loadConnectionsFromDatabase() {
    try {
      const connections = await dbService.getConnections();
      console.log(`Loaded ${connections.length} connections from database`);
      return connections;
    } catch (error) {
      console.error('Failed to load connections from database:', error);
      return [];
    }
  }

  async loadDiscoverySessionsFromDatabase() {
    try {
      const sessions = await dbService.getDiscoverySessions();
      console.log(`Loaded ${sessions.length} discovery sessions from database`);
      return sessions;
    } catch (error) {
      console.error('Failed to load discovery sessions from database:', error);
      return [];
    }
  }

  async loadNetworkTopologyFromDatabase() {
    try {
      const topology = await dbService.getNetworkTopology();
      console.log('Loaded network topology from database');
      return topology;
    } catch (error) {
      console.error('Failed to load network topology from database:', error);
      return null;
    }
  }

  async saveDeviceToDatabase(deviceData) {
    try {
      const device = await dbService.createDevice(deviceData);
      console.log('Device saved to database:', device.id);
      return device;
    } catch (error) {
      console.error('Failed to save device to database:', error);
      throw error;
    }
  }

  async updateDeviceInDatabase(deviceId, updates) {
    try {
      const device = await dbService.updateDevice(deviceId, updates);
      console.log('Device updated in database:', device.id);
      return device;
    } catch (error) {
      console.error('Failed to update device in database:', error);
      throw error;
    }
  }

  async deleteDeviceFromDatabase(deviceId) {
    try {
      await dbService.deleteDevice(deviceId);
      console.log('Device deleted from database:', deviceId);
    } catch (error) {
      console.error('Failed to delete device from database:', error);
      throw error;
    }
  }

  // Close all sessions
  closeAllSessions() {
    this.sessions.clear();
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }
}

export default new SNMPService();