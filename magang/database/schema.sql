-- Network Management Database Schema for Supabase
-- This file contains all the necessary tables for the SNMP Network Discovery application

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

-- Insert some sample data for testing
INSERT INTO devices (host, name, description, device_type, vendor, model, ip_address, status) VALUES
('192.168.1.1', 'Core-Switch-01', 'Cisco Catalyst 2960 Core Switch', 'switch', 'Cisco', 'WS-C2960-24TC-L', '192.168.1.1', 'active'),
('192.168.1.2', 'Access-Switch-01', 'HP ProCurve 2520 Access Switch', 'switch', 'HP', '2520-24G', '192.168.1.2', 'active'),
('192.168.1.3', 'Router-01', 'Cisco ISR 4331 Router', 'router', 'Cisco', 'ISR4331', '192.168.1.3', 'active')
ON CONFLICT (host) DO NOTHING;

-- Insert sample interfaces
INSERT INTO interfaces (device_id, interface_index, name, description, interface_type, mtu, speed, admin_status, oper_status, status, bandwidth)
SELECT 
    d.id,
    generate_series(1, 24) as interface_index,
    'GigabitEthernet0/' || generate_series(1, 24) as name,
    'Gigabit Ethernet Interface ' || generate_series(1, 24) as description,
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

-- Create a view for device summary
CREATE OR REPLACE VIEW device_summary AS
SELECT 
    d.id,
    d.host,
    d.name,
    d.description,
    d.device_type,
    d.vendor,
    d.model,
    d.status,
    d.last_seen,
    COUNT(i.id) as interface_count,
    COUNT(CASE WHEN i.status = 'up' THEN 1 END) as active_interfaces,
    COUNT(c1.id) + COUNT(c2.id) as connection_count
FROM devices d
LEFT JOIN interfaces i ON d.id = i.device_id
LEFT JOIN connections c1 ON d.host = c1.from_host
LEFT JOIN connections c2 ON d.host = c2.to_host
GROUP BY d.id, d.host, d.name, d.description, d.device_type, d.vendor, d.model, d.status, d.last_seen;

-- Create a view for network topology summary
CREATE OR REPLACE VIEW topology_summary AS
SELECT 
    nt.id,
    nt.topology_name,
    nt.device_count,
    nt.connection_count,
    nt.created_at,
    ds.session_name,
    ds.status as discovery_status
FROM network_topology nt
LEFT JOIN discovery_sessions ds ON nt.discovery_session_id = ds.id
ORDER BY nt.created_at DESC;
