# Integrasi dengan SNMP Tools Eksternal

## Opsi 2: Menggunakan Tools SNMP yang Sudah Ada

### 1. SNMPwalk/SNMPget Command Line
```bash
# Install SNMP tools
# Windows: Download Net-SNMP
# Linux: sudo apt-get install snmp snmp-mibs-downloader

# Test koneksi ke switch
snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.2.1.1.1.0

# Get system info
snmpget -v2c -c public 192.168.1.1 1.3.6.1.2.1.1.1.0
```

### 2. Python Script Integration
```python
# snmp-collector.py
from pysnmp.hlapi import *
import json
import time

def get_system_info(host, community='public'):
    for (errorIndication, errorStatus, errorIndex, varBinds) in nextCmd(
        SnmpEngine(),
        CommunityData(community),
        UdpTransportTarget((host, 161)),
        ContextData(),
        ObjectType(ObjectIdentity('1.3.6.1.2.1.1.1.0')),  # sysDescr
        ObjectType(ObjectIdentity('1.3.6.1.2.1.1.5.0')),  # sysName
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

# Run script
get_system_info('192.168.1.1')
```

### 3. Node.js dengan net-snmp
```javascript
// snmp-collector.js
const snmp = require('net-snmp');

function collectSNMPData(host, community = 'public') {
  const session = snmp.createSession(host, community);
  
  const oids = [
    '1.3.6.1.2.1.1.1.0', // sysDescr
    '1.3.6.1.2.1.1.5.0', // sysName
    '1.3.6.1.2.1.1.3.0'  // sysUpTime
  ];
  
  session.get(oids, (varbinds) => {
    varbinds.forEach((vb) => {
      console.log(vb.oid + ' = ' + vb.value);
    });
  });
}

collectSNMPData('192.168.1.1');
```

## Opsi 3: Web-based SNMP Tools

### 1. SNMP Browser Online
- Gunakan tools seperti SNMP Browser
- Export data ke JSON/CSV
- Import ke aplikasi

### 2. SNMP Monitoring Tools
- PRTG Network Monitor
- SolarWinds NPM
- LibreNMS
- Zabbix

## Rekomendasi

**Untuk testing cepat:**
1. Gunakan **snmpwalk** command line
2. Test koneksi ke switch dulu
3. Pastikan community string benar

**Untuk production:**
1. Setup **backend SNMP server** (Opsi 1)
2. Implementasi **real-time monitoring**
3. Tambahkan **error handling** dan **retry logic**

## Testing Koneksi SNMP

```bash
# Test basic connectivity
ping 192.168.1.1

# Test SNMP port
telnet 192.168.1.1 161

# Test SNMP query
snmpget -v2c -c public 192.168.1.1 1.3.6.1.2.1.1.1.0
```

Jika command di atas berhasil, berarti switch bisa diakses via SNMP!
