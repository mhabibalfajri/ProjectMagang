const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const snmp = require('net-snmp');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// SNMP Service
class BackendSNMPService {
  constructor() {
    this.sessions = new Map();
    this.defaultOptions = {
      port: 161,
      retries: 3,
      timeout: 5000,
      transport: 'udp4',
      trapPort: 162,
      version: snmp.Version1,
      idBitsSize: 32
    };
  }

  createSession(host, community = 'public', options = {}) {
    const sessionKey = `${host}:${community}`;
    
    if (this.sessions.has(sessionKey)) {
      return this.sessions.get(sessionKey);
    }

    const sessionOptions = { ...this.defaultOptions, ...options };
    const session = snmp.createSession(host, community, sessionOptions);
    
    this.sessions.set(sessionKey, session);
    return session;
  }

  async getSystemInfo(host, community = 'public') {
    return new Promise((resolve, reject) => {
      const session = this.createSession(host, community);
      
      const oids = [
        '1.3.6.1.2.1.1.1.0', // sysDescr
        '1.3.6.1.2.1.1.2.0', // sysObjectID
        '1.3.6.1.2.1.1.3.0', // sysUpTime
        '1.3.6.1.2.1.1.4.0', // sysContact
        '1.3.6.1.2.1.1.5.0', // sysName
        '1.3.6.1.2.1.1.6.0'  // sysLocation
      ];

      session.get(oids, (error, varbinds) => {
        if (error) {
          reject(error);
          return;
        }

        const systemInfo = {
          sysDescr: varbinds[0].value,
          sysObjectID: varbinds[1].value,
          sysUpTime: varbinds[2].value,
          sysContact: varbinds[3].value,
          sysName: varbinds[4].value,
          sysLocation: varbinds[5].value
        };

        resolve(systemInfo);
      });
    });
  }

  async getInterfaceInfo(host, community = 'public') {
    return new Promise((resolve, reject) => {
      const session = this.createSession(host, community);
      
      const interfaceOids = [
        '1.3.6.1.2.1.2.2.1.1', // ifIndex
        '1.3.6.1.2.1.2.2.1.2', // ifDescr
        '1.3.6.1.2.1.2.2.1.3', // ifType
        '1.3.6.1.2.1.2.2.1.4', // ifMtu
        '1.3.6.1.2.1.2.2.1.5', // ifSpeed
        '1.3.6.1.2.1.2.2.1.6', // ifPhysAddress
        '1.3.6.1.2.1.2.2.1.7', // ifAdminStatus
        '1.3.6.1.2.1.2.2.1.8', // ifOperStatus
        '1.3.6.1.2.1.2.2.1.10', // ifInOctets
        '1.3.6.1.2.1.2.2.1.16'  // ifOutOctets
      ];

      session.walk(interfaceOids, (varbinds) => {
        const interfaces = [];
        const interfaceMap = new Map();

        varbinds.forEach((vb) => {
          const oidParts = vb.oid.split('.');
          const ifIndex = oidParts[oidParts.length - 1];
          const oidType = oidParts.slice(0, -1).join('.');

          if (!interfaceMap.has(ifIndex)) {
            interfaceMap.set(ifIndex, { index: ifIndex });
          }

          const iface = interfaceMap.get(ifIndex);

          switch (oidType) {
            case '1.3.6.1.2.1.2.2.1.2':
              iface.description = vb.value;
              break;
            case '1.3.6.1.2.1.2.2.1.3':
              iface.type = vb.value;
              break;
            case '1.3.6.1.2.1.2.2.1.4':
              iface.mtu = vb.value;
              break;
            case '1.3.6.1.2.1.2.2.1.5':
              iface.speed = vb.value;
              break;
            case '1.3.6.1.2.1.2.2.1.6':
              iface.physicalAddress = vb.value;
              break;
            case '1.3.6.1.2.1.2.2.1.7':
              iface.adminStatus = vb.value;
              break;
            case '1.3.6.1.2.1.2.2.1.8':
              iface.operStatus = vb.value;
              break;
            case '1.3.6.1.2.1.2.2.1.10':
              iface.inOctets = vb.value;
              break;
            case '1.3.6.1.2.1.2.2.1.16':
              iface.outOctets = vb.value;
              break;
          }
        }, (error) => {
          if (error) {
            reject(error);
            return;
          }

          const interfaceList = Array.from(interfaceMap.values())
            .filter(iface => 
              iface.description && 
              !iface.description.toLowerCase().includes('loopback') &&
              !iface.description.toLowerCase().includes('null')
            )
            .map(iface => ({
              ...iface,
              host,
              status: this.getInterfaceStatus(iface.adminStatus, iface.operStatus),
              bandwidth: this.calculateBandwidth(iface.speed),
              utilization: this.calculateUtilization(iface.inOctets, iface.outOctets, iface.speed)
            }));

          resolve({ interfaces: interfaceList });
        });
      });
    });
  }

  async getLLDPNeighbors(host, community = 'public') {
    return new Promise((resolve, reject) => {
      const session = this.createSession(host, community);
      
      const lldpOids = [
        '1.0.8802.1.1.2.1.4.1.1.4', // lldpRemChassisId
        '1.0.8802.1.1.2.1.4.1.1.5', // lldpRemPortId
        '1.0.8802.1.1.2.1.4.1.1.6', // lldpRemSysName
        '1.0.8802.1.1.2.1.4.1.1.7', // lldpRemSysDesc
        '1.0.8802.1.1.2.1.4.1.1.8', // lldpRemSysCapEnabled
        '1.0.8802.1.1.2.1.4.1.1.9'  // lldpRemSysCapSupported
      ];

      session.walk(lldpOids, (varbinds) => {
        const neighbors = [];
        const neighborMap = new Map();

        varbinds.forEach((vb) => {
          const oidParts = vb.oid.split('.');
          const neighborKey = `${oidParts[oidParts.length - 3]}.${oidParts[oidParts.length - 2]}.${oidParts[oidParts.length - 1]}`;
          const oidType = oidParts.slice(0, -3).join('.');

          if (!neighborMap.has(neighborKey)) {
            neighborMap.set(neighborKey, { 
              localPort: oidParts[oidParts.length - 3],
              remotePort: oidParts[oidParts.length - 2],
              ttl: oidParts[oidParts.length - 1]
            });
          }

          const neighbor = neighborMap.get(neighborKey);

          switch (oidType) {
            case '1.0.8802.1.1.2.1.4.1.1.4':
              neighbor.chassisId = vb.value;
              break;
            case '1.0.8802.1.1.2.1.4.1.1.5':
              neighbor.portId = vb.value;
              break;
            case '1.0.8802.1.1.2.1.4.1.1.6':
              neighbor.sysName = vb.value;
              break;
            case '1.0.8802.1.1.2.1.4.1.1.7':
              neighbor.sysDesc = vb.value;
              break;
            case '1.0.8802.1.1.2.1.4.1.1.8':
              neighbor.capEnabled = vb.value;
              break;
            case '1.0.8802.1.1.2.1.4.1.1.9':
              neighbor.capSupported = vb.value;
              break;
          }
        }, (error) => {
          if (error) {
            reject(error);
            return;
          }

          const neighborList = Array.from(neighborMap.values())
            .filter(neighbor => neighbor.sysName)
            .map(neighbor => ({
              ...neighbor,
              host,
              timestamp: new Date().toISOString()
            }));

          resolve({ neighbors: neighborList });
        });
      });
    });
  }

  async getCDPNeighbors(host, community = 'public') {
    return new Promise((resolve, reject) => {
      const session = this.createSession(host, community);
      
      const cdpOids = [
        '1.3.6.1.4.1.9.9.23.1.2.1.1.4', // cdpCacheDeviceId
        '1.3.6.1.4.1.9.9.23.1.2.1.1.5', // cdpCacheDevicePort
        '1.3.6.1.4.1.9.9.23.1.2.1.1.6', // cdpCachePlatform
        '1.3.6.1.4.1.9.9.23.1.2.1.1.7', // cdpCacheCapabilities
        '1.3.6.1.4.1.9.9.23.1.2.1.1.8', // cdpCacheVTPMgmtDomain
        '1.3.6.1.4.1.9.9.23.1.2.1.1.9'  // cdpCacheNativeVLAN
      ];

      session.walk(cdpOids, (varbinds) => {
        const neighbors = [];
        const neighborMap = new Map();

        varbinds.forEach((vb) => {
          const oidParts = vb.oid.split('.');
          const neighborKey = `${oidParts[oidParts.length - 2]}.${oidParts[oidParts.length - 1]}`;
          const oidType = oidParts.slice(0, -2).join('.');

          if (!neighborMap.has(neighborKey)) {
            neighborMap.set(neighborKey, { 
              localPort: oidParts[oidParts.length - 2],
              remotePort: oidParts[oidParts.length - 1]
            });
          }

          const neighbor = neighborMap.get(neighborKey);

          switch (oidType) {
            case '1.3.6.1.4.1.9.9.23.1.2.1.1.4':
              neighbor.deviceId = vb.value;
              break;
            case '1.3.6.1.4.1.9.9.23.1.2.1.1.5':
              neighbor.devicePort = vb.value;
              break;
            case '1.3.6.1.4.1.9.9.23.1.2.1.1.6':
              neighbor.platform = vb.value;
              break;
            case '1.3.6.1.4.1.9.9.23.1.2.1.1.7':
              neighbor.capabilities = vb.value;
              break;
            case '1.3.6.1.4.1.9.9.23.1.2.1.1.8':
              neighbor.vtpDomain = vb.value;
              break;
            case '1.3.6.1.4.1.9.9.23.1.2.1.1.9':
              neighbor.nativeVlan = vb.value;
              break;
          }
        }, (error) => {
          if (error) {
            reject(error);
            return;
          }

          const neighborList = Array.from(neighborMap.values())
            .filter(neighbor => neighbor.deviceId)
            .map(neighbor => ({
              ...neighbor,
              host,
              timestamp: new Date().toISOString()
            }));

          resolve({ neighbors: neighborList });
        });
      });
    });
  }

  async discoverTopology(startHosts, community = 'public') {
    const discoveredDevices = new Map();
    const connections = [];
    const queue = [...startHosts];
    const visited = new Set();

    while (queue.length > 0) {
      const currentHost = queue.shift();
      
      if (visited.has(currentHost)) continue;
      visited.add(currentHost);

      try {
        const systemInfo = await this.getSystemInfo(currentHost, community);
        const interfaces = await this.getInterfaceInfo(currentHost, community);
        const lldpNeighbors = await this.getLLDPNeighbors(currentHost, community);
        const cdpNeighbors = await this.getCDPNeighbors(currentHost, community);

        const device = {
          ...systemInfo,
          host: currentHost,
          interfaces: interfaces.interfaces,
          lldpNeighbors: lldpNeighbors.neighbors,
          cdpNeighbors: cdpNeighbors.neighbors,
          timestamp: new Date().toISOString()
        };

        discoveredDevices.set(currentHost, device);

        // Add neighbors to queue
        [...lldpNeighbors.neighbors, ...cdpNeighbors.neighbors].forEach(neighbor => {
          const neighborHost = neighbor.sysName || neighbor.deviceId;
          if (neighborHost && !visited.has(neighborHost)) {
            queue.push(neighborHost);
            
            connections.push({
              from: currentHost,
              to: neighborHost,
              fromPort: neighbor.localPort,
              toPort: neighbor.portId || neighbor.devicePort,
              type: 'discovered',
              protocol: neighbor.sysName ? 'LLDP' : 'CDP',
              bandwidth: this.estimateBandwidth(neighbor.sysDesc || neighbor.platform)
            });
          }
        });

      } catch (error) {
        console.error(`Error discovering ${currentHost}:`, error.message);
      }
    }

    return {
      devices: Array.from(discoveredDevices.values()),
      connections,
      timestamp: new Date().toISOString()
    };
  }

  // Helper methods
  getInterfaceStatus(adminStatus, operStatus) {
    if (adminStatus === 1 && operStatus === 1) return 'up';
    if (adminStatus === 1 && operStatus === 2) return 'down';
    if (adminStatus === 2) return 'disabled';
    return 'unknown';
  }

  calculateBandwidth(speed) {
    if (speed >= 1000000000) return `${speed / 1000000000}G`;
    if (speed >= 1000000) return `${speed / 1000000}M`;
    if (speed >= 1000) return `${speed / 1000}K`;
    return `${speed}bps`;
  }

  calculateUtilization(inOctets, outOctets, speed) {
    if (!speed || speed === 0) return 0;
    const totalOctets = (inOctets || 0) + (outOctets || 0);
    const utilization = (totalOctets * 8) / speed * 100;
    return Math.min(utilization, 100);
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
}

const snmpService = new BackendSNMPService();

// API Routes
app.post('/api/snmp/system-info', async (req, res) => {
  try {
    const { host, community } = req.body;
    const result = await snmpService.getSystemInfo(host, community);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/snmp/interfaces', async (req, res) => {
  try {
    const { host, community } = req.body;
    const result = await snmpService.getInterfaceInfo(host, community);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/snmp/lldp-neighbors', async (req, res) => {
  try {
    const { host, community } = req.body;
    const result = await snmpService.getLLDPNeighbors(host, community);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/snmp/cdp-neighbors', async (req, res) => {
  try {
    const { host, community } = req.body;
    const result = await snmpService.getCDPNeighbors(host, community);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/snmp/discover-topology', async (req, res) => {
  try {
    const { startHosts, community } = req.body;
    const result = await snmpService.discoverTopology(startHosts, community);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`SNMP Backend Server running on port ${PORT}`);
});

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ server, path: '/snmp' });

wss.on('connection', (ws) => {
  console.log('SNMP WebSocket client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received WebSocket message:', data);
      
      // Handle WebSocket messages here
      ws.send(JSON.stringify({ 
        type: 'ack', 
        message: 'Message received',
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('SNMP WebSocket client disconnected');
  });
});

module.exports = app;
