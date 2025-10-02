# SNMP Network Discovery - Panduan Penggunaan

## Overview
Sistem ini mengimplementasikan fitur SNMP (Simple Network Management Protocol) untuk auto-discovery jaringan dan manajemen device secara otomatis. Fitur ini memungkinkan website topologi jaringan untuk:

1. **Auto-discovery** device jaringan menggunakan SNMP
2. **Deteksi koneksi** antar switch/router secara otomatis
3. **Monitoring real-time** status port dan interface
4. **Manajemen device** terpusat

## Fitur Utama

### 1. SNMP Discovery
- **LLDP (Link Layer Discovery Protocol)**: Mendeteksi neighbors menggunakan standar IEEE 802.1AB
- **CDP (Cisco Discovery Protocol)**: Mendeteksi neighbors pada device Cisco
- **Interface Discovery**: Mendapatkan informasi detail semua port/interface
- **System Information**: Mendapatkan informasi sistem device (nama, deskripsi, uptime, dll)

### 2. Auto Topology Mapping
- Otomatis membuat koneksi antar device berdasarkan neighbor discovery
- Menampilkan bandwidth dan tipe koneksi
- Visualisasi real-time di halaman Network Topology

### 3. Device Management
- Menambah/menghapus device secara manual
- Refresh data device secara real-time
- Monitoring status interface dan port

## Cara Penggunaan

### 1. Konfigurasi SNMP di Settings
1. Buka halaman **Settings**
2. Pilih tab **SNMP**
3. Konfigurasi parameter:
   - **Default Community String**: Biasanya "public" (default)
   - **Timeout**: Waktu tunggu response SNMP (default: 5000ms)
   - **Retries**: Jumlah percobaan ulang (default: 3)
   - **Polling Interval**: Interval polling status device (default: 30 detik)
   - **Enable LLDP/CDP**: Aktifkan protocol discovery
   - **Auto Discovery**: Aktifkan discovery otomatis

### 2. SNMP Network Discovery
1. Buka halaman **Network Topology**
2. Klik tombol **SNMP Discovery**
3. Masukkan **Start Hosts** (IP address device yang akan di-scan):
   ```
   192.168.1.1, 192.168.1.2, 10.0.0.1
   ```
4. Masukkan **SNMP Community String** (biasanya "public")
5. Klik **Test Connection** untuk test koneksi ke device
6. Klik **Start Discovery** untuk memulai auto-discovery

### 3. Device Manager
1. Klik tombol **Device Manager** di halaman Network Topology
2. **Menambah Device**:
   - Klik "Add Device"
   - Masukkan IP address dan community string
   - Klik "Add Device"
3. **Mengelola Device**:
   - View details device
   - Refresh data device
   - Remove device

## Konfigurasi Device

### Switch/Router yang Didukung
Sistem ini mendukung device yang menjalankan SNMP v1/v2c dengan OID standar:

#### Interface Information (RFC 2863)
- `1.3.6.1.2.1.2.2.1.1` - ifIndex
- `1.3.6.1.2.1.2.2.1.2` - ifDescr
- `1.3.6.1.2.1.2.2.1.3` - ifType
- `1.3.6.1.2.1.2.2.1.5` - ifSpeed
- `1.3.6.1.2.1.2.2.1.7` - ifAdminStatus
- `1.3.6.1.2.1.2.2.1.8` - ifOperStatus

#### LLDP Neighbors (IEEE 802.1AB)
- `1.0.8802.1.1.2.1.4.1.1.4` - lldpRemChassisId
- `1.0.8802.1.1.2.1.4.1.1.5` - lldpRemPortId
- `1.0.8802.1.1.2.1.4.1.1.6` - lldpRemSysName
- `1.0.8802.1.1.2.1.4.1.1.7` - lldpRemSysDesc

#### CDP Neighbors (Cisco)
- `1.3.6.1.4.1.9.9.23.1.2.1.1.4` - cdpCacheDeviceId
- `1.3.6.1.4.1.9.9.23.1.2.1.1.5` - cdpCacheDevicePort
- `1.3.6.1.4.1.9.9.23.1.2.1.1.6` - cdpCachePlatform

### Konfigurasi SNMP di Device

#### Cisco Switch/Router
```bash
# Enable SNMP
snmp-server community public RO
snmp-server community private RW

# Enable LLDP
lldp run

# Enable CDP (default enabled)
cdp run
```

#### HP/Aruba Switch
```bash
# Enable SNMP
snmp-server community "public" unrestricted

# Enable LLDP
lldp enable
```

#### Juniper Switch
```bash
# Enable SNMP
set snmp community public authorization read-only

# Enable LLDP
set protocols lldp interface all
```

## Troubleshooting

### 1. Connection Failed
- **Periksa IP address**: Pastikan device dapat di-ping
- **Periksa SNMP**: Pastikan SNMP enabled di device
- **Periksa Community String**: Pastikan community string benar
- **Periksa Firewall**: Pastikan port 161 UDP terbuka

### 2. No Neighbors Found
- **Enable LLDP/CDP**: Pastikan protocol discovery enabled di device
- **Check Protocol Support**: Beberapa device mungkin tidak support LLDP/CDP
- **Manual Connection**: Tambahkan koneksi secara manual jika auto-discovery gagal

### 3. Performance Issues
- **Reduce Polling Interval**: Tingkatkan interval polling di settings
- **Limit Discovery Scope**: Gunakan IP range yang lebih kecil
- **Check Network Load**: Pastikan network tidak overload

## Security Considerations

### 1. Community Strings
- **Gunakan community string yang kuat** untuk production
- **Hindari menggunakan "public"** di environment production
- **Implementasi SNMPv3** untuk security yang lebih baik

### 2. Network Access
- **Restrict SNMP access** ke IP tertentu saja
- **Gunakan VPN** untuk akses remote
- **Monitor SNMP traffic** untuk deteksi anomaly

### 3. Device Configuration
```bash
# Example: Restrict SNMP access
snmp-server community public RO 192.168.1.0 0.0.0.255
snmp-server host 192.168.1.100 version 2c public
```

## API Reference

### SNMP Service Methods
```javascript
// Test connection
const result = await snmpService.getSystemInfo(host, community);

// Get interfaces
const interfaces = await snmpService.getInterfaceInfo(host, community);

// Get LLDP neighbors
const neighbors = await snmpService.getLLDPNeighbors(host, community);

// Auto discovery
const topology = await snmpService.discoverTopology(startHosts, community);
```

### React Hook Usage
```javascript
import { useSNMP } from '../hooks/useSNMP';

const { 
  devices, 
  connections, 
  discoverTopology, 
  addDevice,
  isLoading,
  error 
} = useSNMP();
```

## Contoh Penggunaan

### 1. Discovery Network Sederhana
```javascript
// Start discovery dari core switch
const startHosts = ['192.168.1.1']; // Core switch IP
const community = 'public';

const result = await discoverTopology(startHosts, community);
console.log('Found devices:', result.devices.length);
console.log('Found connections:', result.connections.length);
```

### 2. Monitoring Interface Status
```javascript
// Get interface status dari device
const interfaces = await snmpService.getInterfaceInfo('192.168.1.1', 'public');

interfaces.forEach(iface => {
  console.log(`Port ${iface.description}: ${iface.status}`);
  console.log(`Bandwidth: ${iface.bandwidth}`);
  console.log(`Utilization: ${iface.utilization}%`);
});
```

## Dependencies

### Required Packages
- `net-snmp`: SNMP client library untuk Node.js
- `axios`: HTTP client untuk API calls

### Installation
```bash
npm install net-snmp axios
```

## Support

Untuk pertanyaan atau masalah terkait implementasi SNMP, silakan:
1. Periksa log error di browser console
2. Test koneksi SNMP menggunakan tools seperti `snmpwalk`
3. Verifikasi konfigurasi SNMP di device
4. Pastikan network connectivity antara web server dan device

---

**Note**: Implementasi ini menggunakan SNMP v1/v2c. Untuk production environment, disarankan menggunakan SNMPv3 dengan authentication dan encryption.
