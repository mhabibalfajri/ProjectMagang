#!/usr/bin/env node

/**
 * SNMP Backend Server
 * Real-time SNMP monitoring untuk network devices
 */

import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import cors from 'cors';
import snmp from 'net-snmp';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors());
app.use(express.json());

// SNMP session pool untuk efisiensi
const snmpSessions = new Map();
const monitoringSessions = new Map();

// Port configuration
const PORT = process.env.PORT || 3001;

console.log('🚀 Starting SNMP Backend Server...');

/**
 * Create atau get SNMP session
 */
function getSNMPSession(host, community = 'public', version = snmp.Version2c) {
  const sessionKey = `${host}:${community}:${version}`;
  
  if (snmpSessions.has(sessionKey)) {
    return snmpSessions.get(sessionKey);
  }
  
  try {
    const session = snmp.createSession(host, community, {
      port: 161,
      retries: 3,
      timeout: 5000,
      transport: 'udp4',
      trapPort: 162,
      version: version,
      idBitsSize: 32
    });
    
    snmpSessions.set(sessionKey, session);
    console.log(`✅ SNMP session created for ${host}`);
    return session;
  } catch (error) {
    console.error(`❌ Failed to create SNMP session for ${host}:`, error.message);
    throw error;
  }
}

/**
 * Get system information dari device
 */
app.post('/api/snmp/system-info', async (req, res) => {
  const { host, community = 'public', version = 2 } = req.body;
  
  try {
    console.log(`🔍 Getting system info from ${host}...`);
    
    const session = getSNMPSession(host, community, version === 1 ? snmp.Version1 : snmp.Version2c);
    
    const oids = [
      '1.3.6.1.2.1.1.1.0', // sysDescr
      '1.3.6.1.2.1.1.2.0', // sysObjectID
      '1.3.6.1.2.1.1.3.0', // sysUpTime
      '1.3.6.1.2.1.1.4.0', // sysContact
      '1.3.6.1.2.1.1.5.0', // sysName
      '1.3.6.1.2.1.1.6.0'  // sysLocation
    ];
    
    session.get(oids, (varbinds) => {
      try {
        const result = {
          host: host,
          sysDescr: varbinds[0].value.toString(),
          sysObjectID: varbinds[1].value.toString(),
          sysUpTime: varbinds[2].value.toString(),
          sysContact: varbinds[3].value.toString(),
          sysName: varbinds[4].value.toString(),
          sysLocation: varbinds[5].value.toString(),
          timestamp: new Date().toISOString()
        };
        
        console.log(`✅ System info retrieved from ${host}`);
        res.json(result);
      } catch (error) {
        console.error(`❌ Error processing system info from ${host}:`, error.message);
        res.status(500).json({ error: error.message });
      }
    });
    
  } catch (error) {
    console.error(`❌ Failed to get system info from ${host}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get interface information dari device
 */
app.post('/api/snmp/interfaces', async (req, res) => {
  const { host, community = 'public', version = 2 } = req.body;
  
  try {
    console.log(`🔍 Getting interfaces from ${host}...`);
    
    const session = getSNMPSession(host, community, version === 1 ? snmp.Version1 : snmp.Version2c);
    
    const interfaces = [];
    let completedOids = 0;
    const totalOids = 7;
    
    const oids = [
      '1.3.6.1.2.1.2.2.1.2', // ifDescr
      '1.3.6.1.2.1.2.2.1.3', // ifType
      '1.3.6.1.2.1.2.2.1.4', // ifMtu
      '1.3.6.1.2.1.2.2.1.5', // ifSpeed
      '1.3.6.1.2.1.2.2.1.6', // ifPhysAddress
      '1.3.6.1.2.1.2.2.1.7', // ifAdminStatus
      '1.3.6.1.2.1.2.2.1.8'  // ifOperStatus
    ];
    
    oids.forEach((oid, index) => {
      session.subtree(oid, (varbinds) => {
        varbinds.forEach((vb) => {
          if (vb.oid.length > 0) {
            const interfaceIndex = vb.oid[vb.oid.length - 1];
            
            // Find existing interface or create new one
            let iface = interfaces.find(i => i.index === interfaceIndex);
            if (!iface) {
              iface = { index: interfaceIndex, host: host };
              interfaces.push(iface);
            }
            
            // Set the appropriate field
            switch (index) {
              case 0: iface.description = vb.value.toString(); break;
              case 1: iface.type = vb.value; break;
              case 2: iface.mtu = vb.value; break;
              case 3: iface.speed = vb.value; break;
              case 4: iface.physicalAddress = vb.value.toString(); break;
              case 5: iface.adminStatus = vb.value; break;
              case 6: iface.operStatus = vb.value; break;
            }
          }
        });
        
        completedOids++;
        if (completedOids === totalOids) {
          // Add status text
          interfaces.forEach(iface => {
            iface.status = iface.operStatus === 1 ? 'up' : 'down';
            iface.bandwidth = iface.speed ? formatBandwidth(iface.speed) : 'unknown';
          });
          
          console.log(`✅ Retrieved ${interfaces.length} interfaces from ${host}`);
          res.json({ interfaces, host, timestamp: new Date().toISOString() });
        }
      });
    });
    
  } catch (error) {
    console.error(`❌ Failed to get interfaces from ${host}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get LLDP neighbors
 */
app.post('/api/snmp/lldp-neighbors', async (req, res) => {
  const { host, community = 'public', version = 2 } = req.body;
  
  try {
    console.log(`🔍 Getting LLDP neighbors from ${host}...`);
    
    const session = getSNMPSession(host, community, version === 1 ? snmp.Version1 : snmp.Version2c);
    
    const neighbors = [];
    
    // LLDP MIB OIDs
    const oids = [
      '1.0.8802.1.1.2.1.4.1.1.4',  // lldpRemChassisId
      '1.0.8802.1.1.2.1.4.1.1.7',  // lldpRemSysName
      '1.0.8802.1.1.2.1.4.1.1.9',  // lldpRemSysDesc
      '1.0.8802.1.1.2.1.4.1.1.5',  // lldpRemPortId
      '1.0.8802.1.1.2.1.4.1.1.6'   // lldpRemPortDesc
    ];
    
    session.subtree(oids[0], (varbinds) => {
      varbinds.forEach((vb) => {
        if (vb.oid.length > 0) {
          const neighborIndex = vb.oid[vb.oid.length - 1];
          
          let neighbor = neighbors.find(n => n.index === neighborIndex);
          if (!neighbor) {
            neighbor = { 
              index: neighborIndex, 
              host: host,
              timestamp: new Date().toISOString()
            };
            neighbors.push(neighbor);
          }
          
          neighbor.chassisId = vb.value.toString();
        }
      });
      
      console.log(`✅ Retrieved ${neighbors.length} LLDP neighbors from ${host}`);
      res.json({ neighbors, host, timestamp: new Date().toISOString() });
    });
    
  } catch (error) {
    console.error(`❌ Failed to get LLDP neighbors from ${host}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Test SNMP connection
 */
app.post('/api/snmp/test-connection', async (req, res) => {
  const { host, community = 'public', version = 2 } = req.body;
  
  try {
    console.log(`🧪 Testing SNMP connection to ${host}...`);
    
    const session = getSNMPSession(host, community, version === 1 ? snmp.Version1 : snmp.Version2c);
    
    // Simple test dengan sysDescr
    session.get(['1.3.6.1.2.1.1.1.0'], (varbinds) => {
      const result = {
        success: true,
        host: host,
        message: 'SNMP connection successful',
        sysDescr: varbinds[0].value.toString(),
        timestamp: new Date().toISOString()
      };
      
      console.log(`✅ SNMP test successful for ${host}`);
      res.json(result);
    });
    
  } catch (error) {
    console.error(`❌ SNMP test failed for ${host}:`, error.message);
    res.status(500).json({ 
      success: false,
      host: host,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * WebSocket untuk real-time monitoring
 */
wss.on('connection', (ws) => {
  console.log('🔌 SNMP WebSocket client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'start_monitoring':
          startRealTimeMonitoring(ws, data);
          break;
        case 'stop_monitoring':
          stopRealTimeMonitoring(ws, data);
          break;
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
          break;
      }
    } catch (error) {
      console.error('❌ WebSocket message error:', error.message);
    }
  });
  
  ws.on('close', () => {
    console.log('🔌 SNMP WebSocket client disconnected');
    // Clean up monitoring sessions
    for (const [key, session] of monitoringSessions.entries()) {
      if (session.ws === ws) {
        clearInterval(session.interval);
        monitoringSessions.delete(key);
      }
    }
  });
});

/**
 * Start real-time monitoring
 */
function startRealTimeMonitoring(ws, data) {
  const { host, community = 'public', version = 2, interval = 5000 } = data;
  const sessionKey = `${host}:${ws.id || Date.now()}`;
  
  console.log(`📊 Starting real-time monitoring for ${host}`);
  
  const session = getSNMPSession(host, community, version === 1 ? snmp.Version1 : snmp.Version2c);
  
  const monitoringInterval = setInterval(() => {
    // Get system uptime
    session.get(['1.3.6.1.2.1.1.3.0'], (varbinds) => {
      const monitoringData = {
        type: 'monitoring_data',
        host: host,
        data: {
          sysUpTime: varbinds[0].value.toString(),
          timestamp: new Date().toISOString()
        }
      };
      
      ws.send(JSON.stringify(monitoringData));
    });
  }, interval);
  
  monitoringSessions.set(sessionKey, {
    ws: ws,
    interval: monitoringInterval,
    host: host
  });
  
  ws.send(JSON.stringify({
    type: 'monitoring_started',
    host: host,
    interval: interval,
    timestamp: new Date().toISOString()
  }));
}

/**
 * Stop real-time monitoring
 */
function stopRealTimeMonitoring(ws, data) {
  const { host } = data;
  const sessionKey = `${host}:${ws.id || Date.now()}`;
  
  const session = monitoringSessions.get(sessionKey);
  if (session) {
    clearInterval(session.interval);
    monitoringSessions.delete(sessionKey);
    
    ws.send(JSON.stringify({
      type: 'monitoring_stopped',
      host: host,
      timestamp: new Date().toISOString()
    }));
    
    console.log(`📊 Stopped real-time monitoring for ${host}`);
  }
}

/**
 * Helper function untuk format bandwidth
 */
function formatBandwidth(speed) {
  if (speed >= 1000000000) {
    return `${speed / 1000000000}G`;
  } else if (speed >= 1000000) {
    return `${speed / 1000000}M`;
  } else if (speed >= 1000) {
    return `${speed / 1000}K`;
  } else {
    return `${speed}bps`;
  }
}

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    activeSessions: snmpSessions.size,
    activeMonitoring: monitoringSessions.size
  });
});

/**
 * Get active sessions info
 */
app.get('/api/sessions', (req, res) => {
  const sessions = Array.from(snmpSessions.keys()).map(key => {
    const [host, community, version] = key.split(':');
    return { host, community, version };
  });
  
  res.json({
    sessions: sessions,
    count: sessions.length,
    timestamp: new Date().toISOString()
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🎉 SNMP Backend Server running on port ${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}`);
  console.log(`🌐 HTTP API endpoint: http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down SNMP Backend Server...');
  
  // Close all SNMP sessions
  snmpSessions.forEach((session, key) => {
    session.close();
    console.log(`🔒 Closed SNMP session: ${key}`);
  });
  
  // Stop all monitoring
  monitoringSessions.forEach((session, key) => {
    clearInterval(session.interval);
    console.log(`📊 Stopped monitoring: ${key}`);
  });
  
  server.close(() => {
    console.log('✅ Server closed gracefully');
    process.exit(0);
  });
});