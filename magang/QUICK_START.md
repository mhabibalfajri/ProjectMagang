# 🚀 Quick Start Guide - SNMP Network Topology

## ⚡ Cara Cepat Menjalankan Aplikasi

### 1. Buka Terminal/Command Prompt
Buka terminal di direktori proyek:
```bash
# Navigate ke direktori proyek
cd "C:\Users\A S U S\OneDrive\ドキュメント\Project_Magang\magang"
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

### 3. Menjalankan Aplikasi

#### Opsi A: Menjalankan Frontend Saja (Dengan Mock Data)
```bash
npm run dev
```
- Aplikasi akan berjalan di: http://localhost:5173
- Menggunakan mock data untuk demo SNMP discovery

#### Opsi B: Menjalankan Frontend + Backend (Dengan SNMP Real)
```bash
# Terminal 1 - Backend
npm run backend:dev

# Terminal 2 - Frontend  
npm run dev
```

### 4. Akses Aplikasi
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 🎯 Cara Menggunakan SNMP Discovery

### 1. Buka Network Topology
1. Buka browser ke http://localhost:5173
2. Klik menu **Network Topology**

### 2. SNMP Discovery
1. Klik tombol **SNMP Discovery** (hijau)
2. Masukkan IP address device:
   ```
   192.168.1.1
   192.168.1.2
   10.0.0.1
   ```
3. Masukkan Community String: `public`
4. Klik **Test Connection** untuk test
5. Klik **Start Discovery** untuk memulai

### 3. Device Manager
1. Klik tombol **Device Manager** (biru)
2. **Add Device**: Tambah device manual
3. **View Details**: Lihat detail device
4. **Refresh**: Update data real-time

## 🔧 Konfigurasi SNMP di Device

### Cisco Switch
```bash
# Enable SNMP
configure terminal
snmp-server community public RO
snmp-server community private RW

# Enable LLDP
lldp run

# Enable CDP (default)
cdp run
exit
```

### HP Switch
```bash
# Enable SNMP
snmp-server community "public" unrestricted

# Enable LLDP
lldp enable
```

## 🐛 Troubleshooting

### Error: "Missing script: dev"
```bash
# Pastikan berada di direktori yang benar
pwd
# Harus menunjukkan: .../magang

# Install dependencies
npm install
```

### Error: "global is not defined"
- Ini normal jika menjalankan frontend saja
- Aplikasi akan menggunakan mock data
- Untuk SNMP real, jalankan backend server

### Error: "Connection Failed"
1. **Periksa IP address**: Pastikan device dapat di-ping
2. **Periksa SNMP**: Pastikan SNMP enabled di device
3. **Periksa Community**: Pastikan community string benar
4. **Periksa Firewall**: Pastikan port 161 UDP terbuka

### Backend tidak bisa start
```bash
# Install backend dependencies
cd backend
npm install

# Start backend
npm start
```

## 📱 Demo Mode (Tanpa Backend)

Jika tidak ada device SNMP yang tersedia:

1. Jalankan frontend saja: `npm run dev`
2. Buka http://localhost:5173
3. Klik **SNMP Discovery**
4. Masukkan IP apa saja (contoh: 192.168.1.1)
5. Klik **Start Discovery**
6. Aplikasi akan menggunakan **mock data** untuk demo

## 🎨 Fitur yang Tersedia

### ✅ Yang Sudah Bekerja
- ✅ SNMP Discovery Interface
- ✅ Device Manager
- ✅ Network Topology Visualization
- ✅ Mock Data untuk Demo
- ✅ Settings Configuration
- ✅ Real-time Updates (dengan backend)

### 🔄 Yang Perlu Backend
- 🔄 Real SNMP Communication
- 🔄 LLDP/CDP Discovery
- 🔄 Interface Monitoring
- 🔄 WebSocket Updates

## 📊 Contoh Data Mock

Aplikasi akan menampilkan data seperti:
- **Devices**: Switch-1, Switch-2, Router-1
- **Interfaces**: GigabitEthernet0/1, 0/2, 0/3, dll
- **Connections**: Koneksi antar device
- **Status**: Up/Down status port
- **Bandwidth**: 100M, 1G, 10G

## 🚀 Next Steps

1. **Test dengan Device Real**: Konfigurasi SNMP di switch/router
2. **Jalankan Backend**: Untuk SNMP communication real
3. **Customize Settings**: Sesuaikan konfigurasi SNMP
4. **Monitor Network**: Gunakan untuk monitoring jaringan

## 📞 Support

Jika ada masalah:
1. Periksa log error di browser console
2. Periksa log backend di terminal
3. Pastikan dependencies terinstall
4. Periksa konfigurasi SNMP di device

---

**Happy Networking! 🎉**
