# Network Topology with SNMP Discovery

Aplikasi web untuk visualisasi topologi jaringan dengan fitur auto-discovery menggunakan SNMP (Simple Network Management Protocol).

## 🚀 Fitur Utama

- **Auto-Discovery Jaringan**: Otomatis mendeteksi device dan koneksi menggunakan SNMP
- **LLDP/CDP Support**: Mendukung Link Layer Discovery Protocol dan Cisco Discovery Protocol
- **Real-time Monitoring**: Monitoring status port dan interface secara real-time
- **Interactive Visualization**: Visualisasi topologi jaringan yang interaktif
- **Device Management**: Manajemen device jaringan secara terpusat

## 📋 Prerequisites

- Node.js (v16 atau lebih baru)
- npm atau yarn
- Network device dengan SNMP enabled (Switch/Router)

## 🛠️ Instalasi

### 1. Clone Repository
```bash
git clone <repository-url>
cd magang
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 3. Konfigurasi SNMP di Device

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

## 🚀 Menjalankan Aplikasi

### Opsi 1: Menjalankan Frontend dan Backend Bersamaan
```bash
npm start
```

### Opsi 2: Menjalankan Secara Terpisah

#### Terminal 1 - Backend Server
```bash
npm run backend:dev
```

#### Terminal 2 - Frontend Server
```bash
npm run dev
```

## 🌐 Akses Aplikasi

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **WebSocket**: ws://localhost:3001/snmp

## 📖 Cara Penggunaan

### 1. SNMP Discovery

1. Buka halaman **Network Topology**
2. Klik tombol **SNMP Discovery**
3. Masukkan **Start Hosts** (IP address device):
   ```
   192.168.1.1, 192.168.1.2, 10.0.0.1
   ```
4. Masukkan **SNMP Community String** (default: "public")
5. Klik **Test Connection** untuk verifikasi koneksi
6. Klik **Start Discovery** untuk memulai auto-discovery

### 2. Device Management

1. Klik tombol **Device Manager**
2. **Add Device**: Tambahkan device secara manual
3. **View Details**: Lihat informasi detail device
4. **Refresh**: Update data device real-time
5. **Remove**: Hapus device dari monitoring

### 3. Konfigurasi SNMP

1. Buka halaman **Settings**
2. Pilih tab **SNMP**
3. Konfigurasi parameter:
   - Default Community String
   - Timeout dan Retries
   - Polling Interval
   - Enable/disable LLDP/CDP
   - Auto Discovery settings

## 🔧 Konfigurasi

### Environment Variables

Buat file `.env` di root directory:

```env
# Backend Configuration
BACKEND_PORT=3001
SNMP_TIMEOUT=5000
SNMP_RETRIES=3

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001/snmp
```

### SNMP Settings

Konfigurasi SNMP dapat diubah melalui:
1. **Settings Page** → SNMP Tab
2. **Backend Configuration** (server.js)
3. **Environment Variables**

## 🐛 Troubleshooting

### 1. Connection Failed
- **Periksa IP address**: Pastikan device dapat di-ping
- **Periksa SNMP**: Pastikan SNMP enabled di device
- **Periksa Community String**: Pastikan community string benar
- **Periksa Firewall**: Pastikan port 161 UDP terbuka

### 2. Backend Server Error
```bash
# Check if backend is running
curl http://localhost:3001/api/health

# Check backend logs
cd backend
npm run dev
```

### 3. Frontend Build Error
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for linting errors
npm run lint
```

### 4. SNMP Library Issues
Jika menggunakan browser langsung (tanpa backend):
- Aplikasi akan menggunakan **mock data** untuk demo
- Untuk production, gunakan **backend server**

## 📊 API Endpoints

### SNMP API
- `POST /api/snmp/system-info` - Get system information
- `POST /api/snmp/interfaces` - Get interface information
- `POST /api/snmp/lldp-neighbors` - Get LLDP neighbors
- `POST /api/snmp/cdp-neighbors` - Get CDP neighbors
- `POST /api/snmp/discover-topology` - Auto-discovery topology

### Health Check
- `GET /api/health` - Server health status

## 🔒 Security

### Production Deployment
1. **Gunakan SNMPv3** dengan authentication dan encryption
2. **Restrict SNMP access** ke IP tertentu saja
3. **Gunakan HTTPS/WSS** untuk komunikasi
4. **Implementasi rate limiting**
5. **Monitor SNMP traffic**

### Community String Security
```bash
# Example: Restrict SNMP access
snmp-server community public RO 192.168.1.0 0.0.0.255
snmp-server host 192.168.1.100 version 2c public
```

## 📁 Struktur Project

```
magang/
├── src/
│   ├── components/
│   │   ├── NetworkTopology/
│   │   └── SNMP/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   └── ...
├── backend/
│   ├── server.js
│   └── package.json
├── public/
├── package.json
└── README.md
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - lihat file LICENSE untuk detail.

## 🆘 Support

Untuk pertanyaan atau masalah:
1. Periksa dokumentasi troubleshooting
2. Check GitHub Issues
3. Buat issue baru jika diperlukan

---

**Note**: Untuk production environment, disarankan menggunakan SNMPv3 dengan authentication dan encryption yang lebih aman.