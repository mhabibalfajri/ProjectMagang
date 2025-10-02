// SNMP Service - Browser Compatible Version
// This version uses WebSocket or API calls instead of direct SNMP library

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

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
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
      const result = await this.makeAPICall('/snmp/system-info', {
        host,
        community
      });

      return {
        host,
        description: result.sysDescr || 'Unknown Device',
        objectId: result.sysObjectID || '',
        upTime: result.sysUpTime || '0',
        contact: result.sysContact || '',
        name: result.sysName || host,
        location: result.sysLocation || '',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // Fallback to mock data for demo purposes
      console.warn('SNMP API not available, using mock data:', error.message);
      return this.getMockSystemInfo(host);
    }
  }

  // Get interface information from device
  async getInterfaceInfo(host, community = 'public') {
    try {
      const result = await this.makeAPICall('/snmp/interfaces', {
        host,
        community
      });

      return result.interfaces || [];
    } catch (error) {
      // Fallback to mock data for demo purposes
      console.warn('SNMP API not available, using mock data:', error.message);
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

  // Auto-discovery network topology
  async discoverTopology(startHosts, community = 'public') {
    try {
      const result = await this.makeAPICall('/snmp/discover-topology', {
        startHosts,
        community
      });

      return {
        devices: result.devices || [],
        connections: result.connections || [],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // Fallback to mock discovery for demo purposes
      console.warn('SNMP API not available, using mock discovery:', error.message);
      return this.getMockTopologyDiscovery(startHosts);
    }
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