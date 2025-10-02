# SNMP Architecture - Network Topology System

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (React)                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ NetworkTopology │  │ SNMPDiscovery   │  │ DeviceManager   │ │
│  │     Page        │  │   Component     │  │   Component     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│           │                     │                     │         │
│           └─────────────────────┼─────────────────────┘         │
│                                 │                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                  useSNMP Hook                              │ │
│  │  - State Management                                        │ │
│  │  - API Calls                                               │ │
│  │  - Error Handling                                          │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SNMP Service Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                snmpService.js                              │ │
│  │  - SNMP Session Management                                 │ │
│  │  - Device Communication                                    │ │
│  │  - Data Processing                                         │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Network Devices                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Switch 1  │  │   Switch 2  │  │   Router    │  │  Core   │ │
│  │             │  │             │  │             │  │ Router  │ │
│  │ - SNMP v2c  │  │ - SNMP v2c  │  │ - SNMP v2c  │  │         │ │
│  │ - LLDP      │  │ - LLDP      │  │ - CDP       │  │ - CDP   │ │
│  │ - CDP       │  │ - CDP       │  │ - LLDP      │  │ - LLDP  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Komponen Utama

### 1. Frontend Components

#### NetworkTopology.jsx
- **Fungsi**: Halaman utama untuk visualisasi topologi jaringan
- **Fitur**:
  - Menampilkan network nodes dan connections
  - Integrasi dengan SNMP discovery
  - Modal untuk SNMP Discovery dan Device Manager
  - Konversi data SNMP ke format visualisasi

#### SNMPDiscovery.jsx
- **Fungsi**: Komponen untuk auto-discovery jaringan
- **Fitur**:
  - Input start hosts dan community string
  - Progress bar untuk discovery process
  - Test connection functionality
  - Display discovery results

#### DeviceManager.jsx
- **Fungsi**: Manajemen device jaringan
- **Fitur**:
  - Add/remove devices
  - View device details
  - Refresh device data
  - Interface monitoring

### 2. Service Layer

#### snmpService.js
- **Fungsi**: Core service untuk komunikasi SNMP
- **Methods**:
  - `createSession()`: Membuat SNMP session
  - `getSystemInfo()`: Mendapatkan informasi sistem device
  - `getInterfaceInfo()`: Mendapatkan informasi interface/port
  - `getLLDPNeighbors()`: Mendapatkan LLDP neighbors
  - `getCDPNeighbors()`: Mendapatkan CDP neighbors
  - `discoverTopology()`: Auto-discovery network topology

#### useSNMP.js
- **Fungsi**: React hook untuk state management SNMP
- **State**:
  - `devices`: List device yang ditemukan
  - `connections`: List koneksi antar device
  - `isLoading`: Status loading
  - `error`: Error handling
- **Actions**:
  - `discoverTopology()`: Memulai discovery
  - `addDevice()`: Menambah device
  - `removeDevice()`: Menghapus device
  - `refreshDevice()`: Refresh data device

### 3. Settings Integration

#### Settings.jsx (SNMP Tab)
- **Fungsi**: Konfigurasi SNMP parameters
- **Settings**:
  - Default community string
  - Timeout dan retries
  - Polling interval
  - Enable/disable LLDP/CDP
  - Auto discovery configuration

## Data Flow

### 1. Discovery Process
```
User Input (Start Hosts) 
    ↓
SNMP Discovery Component
    ↓
useSNMP Hook
    ↓
snmpService.discoverTopology()
    ↓
SNMP Queries to Devices
    ↓
Data Processing & Parsing
    ↓
Update State (devices, connections)
    ↓
Visualization Update
```

### 2. Device Management
```
Device Manager Component
    ↓
useSNMP Hook Actions
    ↓
snmpService Methods
    ↓
SNMP Queries
    ↓
Data Update
    ↓
UI Refresh
```

## SNMP OID Mapping

### System Information
- `1.3.6.1.2.1.1.1.0` - sysDescr (Device Description)
- `1.3.6.1.2.1.1.5.0` - sysName (Device Name)
- `1.3.6.1.2.1.1.3.0` - sysUpTime (Uptime)

### Interface Information
- `1.3.6.1.2.1.2.2.1.2` - ifDescr (Interface Description)
- `1.3.6.1.2.1.2.2.1.5` - ifSpeed (Interface Speed)
- `1.3.6.1.2.1.2.2.1.7` - ifAdminStatus (Admin Status)
- `1.3.6.1.2.1.2.2.1.8` - ifOperStatus (Operational Status)

### LLDP Neighbors
- `1.0.8802.1.1.2.1.4.1.1.4` - lldpRemChassisId
- `1.0.8802.1.1.2.1.4.1.1.5` - lldpRemPortId
- `1.0.8802.1.1.2.1.4.1.1.6` - lldpRemSysName

### CDP Neighbors (Cisco)
- `1.3.6.1.4.1.9.9.23.1.2.1.1.4` - cdpCacheDeviceId
- `1.3.6.1.4.1.9.9.23.1.2.1.1.5` - cdpCacheDevicePort

## Error Handling

### 1. Connection Errors
- Timeout handling
- Retry mechanism
- Community string validation
- Network connectivity checks

### 2. Data Processing Errors
- OID parsing errors
- Data format validation
- Missing data handling
- Type conversion errors

### 3. UI Error States
- Loading states
- Error messages
- Retry buttons
- Fallback displays

## Performance Considerations

### 1. SNMP Optimization
- Session reuse
- Batch queries
- Timeout configuration
- Retry limits

### 2. UI Performance
- Lazy loading
- Data caching
- Debounced updates
- Virtual scrolling for large datasets

### 3. Network Optimization
- Parallel queries
- Connection pooling
- Rate limiting
- Bandwidth monitoring

## Security Features

### 1. Input Validation
- IP address validation
- Community string sanitization
- OID validation
- Data type checking

### 2. Access Control
- Community string management
- IP whitelisting
- Session management
- Permission checks

### 3. Data Protection
- Sensitive data masking
- Log sanitization
- Error message filtering
- Audit logging

## Future Enhancements

### 1. SNMPv3 Support
- Authentication
- Encryption
- User management
- Security levels

### 2. Advanced Discovery
- Network scanning
- Subnet discovery
- VLAN detection
- Service discovery

### 3. Real-time Monitoring
- WebSocket integration
- Live updates
- Alert system
- Performance metrics

### 4. Integration Features
- REST API
- Webhook support
- Database integration
- Export functionality
