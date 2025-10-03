# SNMP Backend Server Setup Guide

## 🚀 Setup Backend SNMP Server untuk Real-time Monitoring

### Prerequisites
- Node.js (v16 atau lebih baru)
- Akses ke network switch dengan SNMP enabled
- Community string yang benar (biasanya 'public')

### Langkah 1: Install Dependencies

```bash
cd backend
npm install
```

Dependencies yang akan diinstall:
- `express` - Web server
- `ws` - WebSocket server
- `cors` - Cross-origin resource sharing
- `net-snmp` - SNMP library untuk Node.js
- `dotenv` - Environment variables

### Langkah 2: Test SNMP Connection

```bash
# Test koneksi ke switch
node test-snmp.js

# Test specific host
node test-snmp.js 192.168.1.1 public
```

### Langkah 3: Start Backend Server

```bash
# Start server
npm start

# Atau dengan nodemon untuk development
npm run dev
```

Server akan berjalan di:
- **HTTP API**: http://localhost:3001/api
- **WebSocket**: ws://localhost:3001
- **Health Check**: http://localhost:3001/api/health

### Langkah 4: Test API Endpoints

#### Test Connection
```bash
curl -X POST http://localhost:3001/api/snmp/test-connection \
  -H "Content-Type: application/json" \
  -d '{"host": "192.168.1.1", "community": "public"}'
```

#### Get System Info
```bash
curl -X POST http://localhost:3001/api/snmp/system-info \
  -H "Content-Type: application/json" \
  -d '{"host": "192.168.1.1", "community": "public"}'
```

#### Get Interfaces
```bash
curl -X POST http://localhost:3001/api/snmp/interfaces \
  -H "Content-Type: application/json" \
  -d '{"host": "192.168.1.1", "community": "public"}'
```

### Langkah 5: Test Frontend Integration

1. **Start Backend Server**:
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend**:
   ```bash
   cd ..
   npm run dev
   ```

3. **Test di Browser**:
   - Buka http://localhost:5173
   - Go to SNMP Discovery page
   - Click "Show Real-time Test"
   - Test koneksi ke switch

## 🔧 API Endpoints

### POST /api/snmp/test-connection
Test koneksi SNMP ke device.

**Request:**
```json
{
  "host": "192.168.1.1",
  "community": "public",
  "version": 2
}
```

**Response:**
```json
{
  "success": true,
  "host": "192.168.1.1",
  "message": "SNMP connection successful",
  "sysDescr": "Cisco IOS Software, C2960 Software...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/snmp/system-info
Get system information dari device.

**Request:**
```json
{
  "host": "192.168.1.1",
  "community": "public",
  "version": 2
}
```

**Response:**
```json
{
  "host": "192.168.1.1",
  "sysDescr": "Cisco IOS Software, C2960 Software...",
  "sysObjectID": "1.3.6.1.4.1.9.1.716",
  "sysUpTime": "1234567890",
  "sysContact": "admin@company.com",
  "sysName": "Switch-01",
  "sysLocation": "Data Center",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/snmp/interfaces
Get interface information dari device.

**Request:**
```json
{
  "host": "192.168.1.1",
  "community": "public",
  "version": 2
}
```

**Response:**
```json
{
  "interfaces": [
    {
      "index": 1,
      "name": "GigabitEthernet0/1",
      "description": "Gigabit Ethernet Interface 1",
      "type": 6,
      "mtu": 1500,
      "speed": 1000000000,
      "adminStatus": 1,
      "operStatus": 1,
      "status": "up",
      "bandwidth": "1G"
    }
  ],
  "host": "192.168.1.1",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/snmp/lldp-neighbors
Get LLDP neighbors dari device.

**Request:**
```json
{
  "host": "192.168.1.1",
  "community": "public",
  "version": 2
}
```

**Response:**
```json
{
  "neighbors": [
    {
      "index": 1,
      "chassisId": "00:11:22:33:44:55",
      "sysName": "Switch-02",
      "sysDesc": "Cisco IOS Software...",
      "portId": "GigabitEthernet0/1",
      "portDesc": "Gigabit Ethernet Interface 1"
    }
  ],
  "host": "192.168.1.1",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔌 WebSocket Real-time Monitoring

### Connect to WebSocket
```javascript
const ws = new WebSocket('ws://localhost:3001');

ws.onopen = () => {
  console.log('Connected to SNMP WebSocket');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

### Start Monitoring
```javascript
ws.send(JSON.stringify({
  type: 'start_monitoring',
  host: '192.168.1.1',
  community: 'public',
  version: 2,
  interval: 5000
}));
```

### Stop Monitoring
```javascript
ws.send(JSON.stringify({
  type: 'stop_monitoring',
  host: '192.168.1.1'
}));
```

### Monitoring Data
```javascript
// Received data format
{
  "type": "monitoring_data",
  "host": "192.168.1.1",
  "data": {
    "sysUpTime": "1234567890",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🧪 Testing Commands

### Test SNMP dengan Command Line
```bash
# Install SNMP tools (Linux/Ubuntu)
sudo apt-get install snmp snmp-mibs-downloader

# Test basic connectivity
snmpget -v2c -c public 192.168.1.1 1.3.6.1.2.1.1.1.0

# Get system info
snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.2.1.1

# Get interfaces
snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.2.1.2.2.1.2
```

### Test dengan Python
```python
from pysnmp.hlapi import *

for (errorIndication, errorStatus, errorIndex, varBinds) in nextCmd(
    SnmpEngine(),
    CommunityData('public'),
    UdpTransportTarget(('192.168.1.1', 161)),
    ContextData(),
    ObjectType(ObjectIdentity('1.3.6.1.2.1.1.1.0')),
    lexicographicMode=False):
    
    if errorIndication:
        print(errorIndication)
        break
    elif errorStatus:
        print('%s at %s' % (errorStatus.prettyPrint(),
                            errorIndex and varBinds[int(errorIndex) - 1][0] or '?'))
        break
    else:
        for varBind in varBinds:
            print(' = '.join([x.prettyPrint() for x in varBind]))
```

## 🔍 Troubleshooting

### Common Issues

#### 1. SNMP Connection Failed
**Error**: `SNMP connection failed`
**Solution**:
- Check IP address dan network connectivity
- Verify SNMP community string
- Ensure SNMP is enabled on device
- Check firewall settings

#### 2. Timeout Error
**Error**: `SNMP timeout`
**Solution**:
- Increase timeout value in config
- Check network latency
- Verify device is responding to ping

#### 3. Permission Denied
**Error**: `Permission denied`
**Solution**:
- Check SNMP community string permissions
- Verify SNMP version (v1 vs v2c)
- Check device SNMP configuration

#### 4. WebSocket Connection Failed
**Error**: `WebSocket connection failed`
**Solution**:
- Ensure backend server is running
- Check port 3001 is not blocked
- Verify CORS settings

### Debug Mode

Enable debug logging:
```bash
LOG_LEVEL=debug npm start
```

### Health Check
```bash
curl http://localhost:3001/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "activeSessions": 2,
  "activeMonitoring": 1
}
```

## 📊 Monitoring Dashboard

### Active Sessions
```bash
curl http://localhost:3001/api/sessions
```

Response:
```json
{
  "sessions": [
    {
      "host": "192.168.1.1",
      "community": "public",
      "version": "2"
    }
  ],
  "count": 1,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🚀 Production Deployment

### Environment Variables
```bash
# .env file
PORT=3001
DEFAULT_COMMUNITY=public
DEFAULT_VERSION=2
DEFAULT_TIMEOUT=5000
DEFAULT_RETRIES=3
LOG_LEVEL=info
API_KEY=your-secret-api-key
ALLOWED_ORIGINS=https://yourdomain.com
```

### Security Considerations
1. **API Key Authentication**: Implement API key untuk production
2. **CORS Configuration**: Restrict allowed origins
3. **Rate Limiting**: Implement rate limiting untuk API calls
4. **Input Validation**: Validate semua input parameters
5. **Error Handling**: Proper error handling dan logging

### Performance Optimization
1. **Connection Pooling**: Reuse SNMP sessions
2. **Caching**: Cache frequently accessed data
3. **Load Balancing**: Multiple backend instances
4. **Monitoring**: Monitor server performance

## 📋 Checklist

- [ ] Backend server installed dan running
- [ ] SNMP connection test successful
- [ ] API endpoints responding
- [ ] WebSocket connection working
- [ ] Frontend integration complete
- [ ] Real-time monitoring functional
- [ ] Database integration working
- [ ] Error handling implemented
- [ ] Security measures in place
- [ ] Performance optimized

## 🎉 Success!

Jika semua checklist di atas sudah completed, maka SNMP backend server sudah siap untuk production use dengan real-time monitoring capabilities!
