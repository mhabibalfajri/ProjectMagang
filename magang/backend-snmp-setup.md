# Setup Backend SNMP Server

## Prerequisites
- Node.js backend server
- SNMP library untuk Node.js
- Akses ke network switch

## Langkah-langkah:

### 1. Install Dependencies
```bash
cd backend
npm install net-snmp
npm install express
npm install ws
```

### 2. Create SNMP Backend Server
```javascript
// backend/snmp-server.js
const express = require('express');
const WebSocket = require('ws');
const snmp = require('net-snmp');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

// SNMP session pool
const sessions = new Map();

// Create SNMP session
function createSNMPSession(host, community = 'public') {
  const sessionKey = `${host}:${community}`;
  
  if (sessions.has(sessionKey)) {
    return sessions.get(sessionKey);
  }
  
  const session = snmp.createSession(host, community, {
    port: 161,
    retries: 3,
    timeout: 5000,
    transport: 'udp4',
    trapPort: 162,
    version: snmp.Version1,
    idBitsSize: 32
  });
  
  sessions.set(sessionKey, session);
  return session;
}

// Get system info
app.post('/api/snmp/system-info', (req, res) => {
  const { host, community } = req.body;
  
  try {
    const session = createSNMPSession(host, community);
    
    const oids = [
      '1.3.6.1.2.1.1.1.0', // sysDescr
      '1.3.6.1.2.1.1.2.0', // sysObjectID
      '1.3.6.1.2.1.1.3.0', // sysUpTime
      '1.3.6.1.2.1.1.4.0', // sysContact
      '1.3.6.1.2.1.1.5.0', // sysName
      '1.3.6.1.2.1.1.6.0'  // sysLocation
    ];
    
    session.get(oids, (varbinds) => {
      const result = {
        sysDescr: varbinds[0].value,
        sysObjectID: varbinds[1].value,
        sysUpTime: varbinds[2].value,
        sysContact: varbinds[3].value,
        sysName: varbinds[4].value,
        sysLocation: varbinds[5].value
      };
      
      res.json(result);
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get interfaces
app.post('/api/snmp/interfaces', (req, res) => {
  const { host, community } = req.body;
  
  try {
    const session = createSNMPSession(host, community);
    
    // Get interface table
    const oids = [
      '1.3.6.1.2.1.2.2.1.2', // ifDescr
      '1.3.6.1.2.1.2.2.1.3', // ifType
      '1.3.6.1.2.1.2.2.1.4', // ifMtu
      '1.3.6.1.2.1.2.2.1.5', // ifSpeed
      '1.3.6.1.2.1.2.2.1.6', // ifPhysAddress
      '1.3.6.1.2.1.2.2.1.7', // ifAdminStatus
      '1.3.6.1.2.1.2.2.1.8'  // ifOperStatus
    ];
    
    session.subtree(oids[0], (varbinds) => {
      const interfaces = [];
      
      varbinds.forEach((vb) => {
        if (vb.oid.length > 0) {
          const index = vb.oid[vb.oid.length - 1];
          interfaces.push({
            index: index,
            description: vb.value,
            // Add other fields...
          });
        }
      });
      
      res.json({ interfaces });
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WebSocket for real-time monitoring
wss.on('connection', (ws) => {
  console.log('SNMP WebSocket client connected');
  
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    if (data.type === 'start_monitoring') {
      const { host, community, interval = 5000 } = data;
      
      const session = createSNMPSession(host, community);
      
      const monitorInterval = setInterval(() => {
        // Get system info
        const oids = ['1.3.6.1.2.1.1.3.0']; // sysUpTime
        
        session.get(oids, (varbinds) => {
          ws.send(JSON.stringify({
            type: 'snmp_data',
            host: host,
            data: {
              sysUpTime: varbinds[0].value,
              timestamp: new Date().toISOString()
            }
          }));
        });
      }, interval);
      
      ws.on('close', () => {
        clearInterval(monitorInterval);
      });
    }
  });
  
  ws.on('close', () => {
    console.log('SNMP WebSocket client disconnected');
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`SNMP Backend Server running on port ${PORT}`);
});
```

### 3. Start Backend Server
```bash
node snmp-server.js
```

### 4. Update Frontend
Frontend sudah siap untuk connect ke backend ini!

## Testing
1. Start backend server
2. Start frontend: `npm run dev`
3. Test connection ke switch real
4. Monitor real-time data
