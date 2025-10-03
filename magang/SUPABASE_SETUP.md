# Supabase Database Setup Guide

This guide will help you set up the Supabase database for the Network Management application.

## Prerequisites

- Supabase project URL: `https://feoyvuyklhtwrljxweht.supabase.co`
- API Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlb3l2dXlrbGh0d3Jsanh3ZWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNzY2MjQsImV4cCI6MjA3NDk1MjYyNH0.Mmu9CpGrZwKeq4sByOAokk4NDHStpQPmdO-hoWbSP1U`

## Manual Database Setup

### Step 1: Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your project: `feoyvuyklhtwrljxweht`
3. Click on "SQL Editor" in the left sidebar

### Step 2: Create Database Tables

Copy and paste the following SQL commands into the SQL Editor and execute them:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    host VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    description TEXT,
    object_id VARCHAR(255),
    up_time BIGINT,
    contact VARCHAR(255),
    location VARCHAR(255),
    device_type VARCHAR(100),
    vendor VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(255),
    firmware_version VARCHAR(100),
    ip_address INET,
    mac_address MACADDR,
    snmp_community VARCHAR(100) DEFAULT 'public',
    snmp_version INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'active',
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interfaces table
CREATE TABLE IF NOT EXISTS interfaces (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    interface_index INTEGER NOT NULL,
    name VARCHAR(255),
    description TEXT,
    interface_type INTEGER,
    mtu INTEGER,
    speed BIGINT,
    physical_address MACADDR,
    admin_status INTEGER,
    oper_status INTEGER,
    status VARCHAR(20),
    bandwidth VARCHAR(20),
    utilization INTEGER DEFAULT 0,
    vlan_id INTEGER,
    duplex VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(device_id, interface_index)
);

-- Create connections table
CREATE TABLE IF NOT EXISTS connections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    from_host VARCHAR(255) NOT NULL,
    to_host VARCHAR(255) NOT NULL,
    from_port VARCHAR(100),
    to_port VARCHAR(100),
    connection_type VARCHAR(50) DEFAULT 'discovered',
    protocol VARCHAR(20) DEFAULT 'LLDP',
    bandwidth VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    discovered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(from_host, to_host, from_port, to_port)
);

-- Create discovery_sessions table
CREATE TABLE IF NOT EXISTS discovery_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_name VARCHAR(255),
    start_hosts TEXT[] NOT NULL,
    community_string VARCHAR(100) DEFAULT 'public',
    status VARCHAR(20) DEFAULT 'running',
    devices_found INTEGER DEFAULT 0,
    connections_found INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create network_topology table
CREATE TABLE IF NOT EXISTS network_topology (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    topology_name VARCHAR(255),
    topology_data JSONB NOT NULL,
    device_count INTEGER DEFAULT 0,
    connection_count INTEGER DEFAULT 0,
    discovery_session_id UUID REFERENCES discovery_sessions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create snmp_data table for storing SNMP monitoring data
CREATE TABLE IF NOT EXISTS snmp_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    oid VARCHAR(255) NOT NULL,
    value TEXT,
    data_type VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_devices_host ON devices(host);
CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status);
CREATE INDEX IF NOT EXISTS idx_devices_last_seen ON devices(last_seen);
CREATE INDEX IF NOT EXISTS idx_interfaces_device_id ON interfaces(device_id);
CREATE INDEX IF NOT EXISTS idx_interfaces_status ON interfaces(status);
CREATE INDEX IF NOT EXISTS idx_connections_from_host ON connections(from_host);
CREATE INDEX IF NOT EXISTS idx_connections_to_host ON connections(to_host);
CREATE INDEX IF NOT EXISTS idx_connections_status ON connections(status);
CREATE INDEX IF NOT EXISTS idx_discovery_sessions_status ON discovery_sessions(status);
CREATE INDEX IF NOT EXISTS idx_discovery_sessions_started_at ON discovery_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_snmp_data_device_id ON snmp_data(device_id);
CREATE INDEX IF NOT EXISTS idx_snmp_data_timestamp ON snmp_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_snmp_data_oid ON snmp_data(oid);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interfaces_updated_at BEFORE UPDATE ON interfaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_connections_updated_at BEFORE UPDATE ON connections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discovery_sessions_updated_at BEFORE UPDATE ON discovery_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_network_topology_updated_at BEFORE UPDATE ON network_topology
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS (Row Level Security) policies
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE interfaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_topology ENABLE ROW LEVEL SECURITY;
ALTER TABLE snmp_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access" ON devices FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON devices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON devices FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON devices FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON interfaces FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON interfaces FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON interfaces FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON interfaces FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON connections FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON connections FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON connections FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON connections FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON discovery_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON discovery_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON discovery_sessions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON discovery_sessions FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON network_topology FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON network_topology FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON network_topology FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON network_topology FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON snmp_data FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON snmp_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON snmp_data FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON snmp_data FOR DELETE USING (true);
```

### Step 3: Insert Sample Data

After creating the tables, you can insert some sample data:

```sql
-- Insert sample devices
INSERT INTO devices (host, name, description, device_type, vendor, model, ip_address, status) VALUES
('192.168.1.1', 'Core-Switch-01', 'Cisco Catalyst 2960 Core Switch', 'switch', 'Cisco', 'WS-C2960-24TC-L', '192.168.1.1', 'active'),
('192.168.1.2', 'Access-Switch-01', 'HP ProCurve 2520 Access Switch', 'switch', 'HP', '2520-24G', '192.168.1.2', 'active'),
('192.168.1.3', 'Router-01', 'Cisco ISR 4331 Router', 'router', 'Cisco', 'ISR4331', '192.168.1.3', 'active')
ON CONFLICT (host) DO NOTHING;

-- Insert sample interfaces
INSERT INTO interfaces (device_id, interface_index, name, description, interface_type, mtu, speed, admin_status, oper_status, status, bandwidth)
SELECT 
    d.id,
    generate_series(1, 8) as interface_index,
    'GigabitEthernet0/' || generate_series(1, 8) as name,
    'Gigabit Ethernet Interface ' || generate_series(1, 8) as description,
    6 as interface_type,
    1500 as mtu,
    1000000000 as speed,
    1 as admin_status,
    CASE WHEN random() > 0.2 THEN 1 ELSE 2 END as oper_status,
    CASE WHEN random() > 0.2 THEN 'up' ELSE 'down' END as status,
    '1G' as bandwidth
FROM devices d
WHERE d.host IN ('192.168.1.1', '192.168.1.2', '192.168.1.3')
ON CONFLICT (device_id, interface_index) DO NOTHING;

-- Insert sample connections
INSERT INTO connections (from_host, to_host, from_port, to_port, connection_type, protocol, bandwidth, status)
VALUES
('192.168.1.1', '192.168.1.2', 'GigabitEthernet0/1', 'GigabitEthernet0/1', 'discovered', 'LLDP', '1G', 'active'),
('192.168.1.1', '192.168.1.3', 'GigabitEthernet0/2', 'GigabitEthernet0/1', 'discovered', 'LLDP', '1G', 'active'),
('192.168.1.2', '192.168.1.3', 'GigabitEthernet0/2', 'GigabitEthernet0/2', 'discovered', 'CDP', '1G', 'active')
ON CONFLICT (from_host, to_host, from_port, to_port) DO NOTHING;
```

### Step 4: Verify Setup

1. Go to the "Table Editor" in your Supabase dashboard
2. You should see the following tables:
   - `devices`
   - `interfaces`
   - `connections`
   - `discovery_sessions`
   - `network_topology`
   - `snmp_data`

3. Check that sample data has been inserted correctly

## Application Integration

The application is already configured to use Supabase with the following features:

### Database Service (`src/config/supabase.js`)
- Supabase client configuration
- Database service class with CRUD operations
- Automatic data synchronization

### SNMP Service Integration (`src/services/snmpService.js`)
- Automatic saving of discovery results to database
- Device detection and classification
- Connection mapping and storage

### React Hook Integration (`src/hooks/useSNMP.js`)
- Automatic loading of data from database on component mount
- Real-time synchronization with database
- CRUD operations for devices and connections

## Usage

Once the database is set up:

1. Start the application: `npm run dev`
2. The application will automatically connect to Supabase
3. All SNMP discovery results will be saved to the database
4. Data persists between sessions
5. You can view and manage data through the Supabase dashboard

## Troubleshooting

### Connection Issues
- Verify the Supabase URL and API key are correct
- Check that your Supabase project is active
- Ensure Row Level Security policies are properly configured

### Table Creation Issues
- Make sure you have the necessary permissions in Supabase
- Check that the `uuid-ossp` extension is enabled
- Verify that all SQL commands executed successfully

### Data Issues
- Check the browser console for any error messages
- Verify that the database tables exist and have the correct structure
- Ensure that RLS policies allow the operations you're trying to perform

## Security Notes

The current setup uses public access policies for simplicity. For production use, consider:

1. Implementing proper authentication
2. Using more restrictive RLS policies
3. Adding user-specific data access controls
4. Implementing proper API key management

## Support

If you encounter any issues:

1. Check the Supabase dashboard for error logs
2. Review the browser console for client-side errors
3. Verify that all dependencies are properly installed
4. Ensure the database schema matches the application expectations
