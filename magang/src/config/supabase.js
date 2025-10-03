import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://feoyvuyklhtwrljxweht.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlb3l2dXlrbGh0d3Jsanh3ZWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNzY2MjQsImV4cCI6MjA3NDk1MjYyNH0.Mmu9CpGrZwKeq4sByOAokk4NDHStpQPmdO-hoWbSP1U'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database table names
export const TABLES = {
  DEVICES: 'devices',
  INTERFACES: 'interfaces',
  CONNECTIONS: 'connections',
  DISCOVERY_SESSIONS: 'discovery_sessions',
  NETWORK_TOPOLOGY: 'network_topology',
  SNMP_DATA: 'snmp_data'
}

// Database service class
export class DatabaseService {
  constructor() {
    this.supabase = supabase
  }

  // Device operations
  async createDevice(deviceData) {
    const { data, error } = await this.supabase
      .from(TABLES.DEVICES)
      .insert([deviceData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getDevices() {
    const { data, error } = await this.supabase
      .from(TABLES.DEVICES)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  async updateDevice(id, updates) {
    const { data, error } = await this.supabase
      .from(TABLES.DEVICES)
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async deleteDevice(id) {
    const { error } = await this.supabase
      .from(TABLES.DEVICES)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // Interface operations
  async createInterfaces(interfaces) {
    const { data, error } = await this.supabase
      .from(TABLES.INTERFACES)
      .insert(interfaces)
      .select()
    
    if (error) throw error
    return data
  }

  async getInterfacesByDevice(deviceId) {
    const { data, error } = await this.supabase
      .from(TABLES.INTERFACES)
      .select('*')
      .eq('device_id', deviceId)
      .order('interface_index', { ascending: true })
    
    if (error) throw error
    return data
  }

  // Connection operations
  async createConnections(connections) {
    const { data, error } = await this.supabase
      .from(TABLES.CONNECTIONS)
      .insert(connections)
      .select()
    
    if (error) throw error
    return data
  }

  async getConnections() {
    const { data, error } = await this.supabase
      .from(TABLES.CONNECTIONS)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  // Discovery session operations
  async createDiscoverySession(sessionData) {
    const { data, error } = await this.supabase
      .from(TABLES.DISCOVERY_SESSIONS)
      .insert([sessionData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getDiscoverySessions() {
    const { data, error } = await this.supabase
      .from(TABLES.DISCOVERY_SESSIONS)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  // Network topology operations
  async saveNetworkTopology(topologyData) {
    const { data, error } = await this.supabase
      .from(TABLES.NETWORK_TOPOLOGY)
      .insert([topologyData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getNetworkTopology() {
    const { data, error } = await this.supabase
      .from(TABLES.NETWORK_TOPOLOGY)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // SNMP data operations
  async saveSNMPData(snmpData) {
    const { data, error } = await this.supabase
      .from(TABLES.SNMP_DATA)
      .insert([snmpData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getSNMPDataByDevice(deviceId) {
    const { data, error } = await this.supabase
      .from(TABLES.SNMP_DATA)
      .select('*')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  // Bulk operations for discovery
  async saveDiscoveryResults(devices, connections, sessionId) {
    try {
      // Start a transaction-like operation
      const results = {
        devices: [],
        connections: [],
        session: null
      }

      // Save devices
      if (devices && devices.length > 0) {
        const { data: deviceData, error: deviceError } = await this.supabase
          .from(TABLES.DEVICES)
          .upsert(devices, { onConflict: 'host' })
          .select()
        
        if (deviceError) throw deviceError
        results.devices = deviceData
      }

      // Save connections
      if (connections && connections.length > 0) {
        const { data: connectionData, error: connectionError } = await this.supabase
          .from(TABLES.CONNECTIONS)
          .upsert(connections, { onConflict: 'from_host,to_host,from_port,to_port' })
          .select()
        
        if (connectionError) throw connectionError
        results.connections = connectionData
      }

      // Update session status
      if (sessionId) {
        const { data: sessionData, error: sessionError } = await this.supabase
          .from(TABLES.DISCOVERY_SESSIONS)
          .update({ 
            status: 'completed',
            devices_found: devices?.length || 0,
            connections_found: connections?.length || 0,
            completed_at: new Date().toISOString()
          })
          .eq('id', sessionId)
          .select()
          .single()
        
        if (sessionError) throw sessionError
        results.session = sessionData
      }

      return results
    } catch (error) {
      console.error('Error saving discovery results:', error)
      throw error
    }
  }
}

export const dbService = new DatabaseService()
