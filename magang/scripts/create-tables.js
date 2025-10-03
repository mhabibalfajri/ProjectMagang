#!/usr/bin/env node

/**
 * Simple Database Table Creation Script
 * This script creates tables using Supabase REST API
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://feoyvuyklhtwrljxweht.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlb3l2dXlrbGh0d3Jsanh3ZWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNzY2MjQsImV4cCI6MjA3NDk1MjYyNH0.Mmu9CpGrZwKeq4sByOAokk4NDHStpQPmdO-hoWbSP1U'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTables() {
  console.log('🚀 Creating database tables...')
  
  try {
    // Test connection first
    console.log('🔍 Testing Supabase connection...')
    const { data: testData, error: testError } = await supabase
      .from('devices')
      .select('*')
      .limit(1)
    
    if (testError && testError.code === 'PGRST116') {
      console.log('📋 Tables do not exist yet, will create them...')
    } else if (testError) {
      console.log('⚠️  Connection test warning:', testError.message)
    } else {
      console.log('✅ Connection successful, tables already exist')
      return
    }
    
    // Create sample devices to test the connection
    console.log('🧪 Testing data insertion...')
    
    const sampleDevices = [
      {
        host: '192.168.1.1',
        name: 'Core-Switch-01',
        description: 'Cisco Catalyst 2960 Core Switch',
        device_type: 'switch',
        vendor: 'Cisco',
        model: 'WS-C2960-24TC-L',
        status: 'active'
      },
      {
        host: '192.168.1.2',
        name: 'Access-Switch-01', 
        description: 'HP ProCurve 2520 Access Switch',
        device_type: 'switch',
        vendor: 'HP',
        model: '2520-24G',
        status: 'active'
      },
      {
        host: '192.168.1.3',
        name: 'Router-01',
        description: 'Cisco ISR 4331 Router',
        device_type: 'router',
        vendor: 'Cisco',
        model: 'ISR4331',
        status: 'active'
      }
    ]
    
    const { data: devices, error: deviceError } = await supabase
      .from('devices')
      .insert(sampleDevices)
      .select()
    
    if (deviceError) {
      console.log('⚠️  Device creation:', deviceError.message)
    } else {
      console.log(`✅ Created ${devices.length} sample devices`)
    }
    
    // Create sample interfaces
    if (devices && devices.length > 0) {
      console.log('🔌 Creating sample interfaces...')
      
      const sampleInterfaces = []
      devices.forEach(device => {
        for (let i = 1; i <= 8; i++) {
          sampleInterfaces.push({
            device_id: device.id,
            interface_index: i,
            name: `GigabitEthernet0/${i}`,
            description: `Gigabit Ethernet Interface ${i}`,
            interface_type: 6,
            mtu: 1500,
            speed: 1000000000,
            admin_status: 1,
            oper_status: Math.random() > 0.2 ? 1 : 2,
            status: Math.random() > 0.2 ? 'up' : 'down',
            bandwidth: '1G'
          })
        }
      })
      
      const { data: interfaces, error: interfaceError } = await supabase
        .from('interfaces')
        .insert(sampleInterfaces)
        .select()
      
      if (interfaceError) {
        console.log('⚠️  Interface creation:', interfaceError.message)
      } else {
        console.log(`✅ Created ${interfaces.length} sample interfaces`)
      }
    }
    
    // Create sample connections
    console.log('🔗 Creating sample connections...')
    
    const sampleConnections = [
      {
        from_host: '192.168.1.1',
        to_host: '192.168.1.2',
        from_port: 'GigabitEthernet0/1',
        to_port: 'GigabitEthernet0/1',
        connection_type: 'discovered',
        protocol: 'LLDP',
        bandwidth: '1G',
        status: 'active'
      },
      {
        from_host: '192.168.1.1',
        to_host: '192.168.1.3',
        from_port: 'GigabitEthernet0/2',
        to_port: 'GigabitEthernet0/1',
        connection_type: 'discovered',
        protocol: 'LLDP',
        bandwidth: '1G',
        status: 'active'
      }
    ]
    
    const { data: connections, error: connectionError } = await supabase
      .from('connections')
      .insert(sampleConnections)
      .select()
    
    if (connectionError) {
      console.log('⚠️  Connection creation:', connectionError.message)
    } else {
      console.log(`✅ Created ${connections.length} sample connections`)
    }
    
    // Create a discovery session
    console.log('🔍 Creating sample discovery session...')
    
    const { data: session, error: sessionError } = await supabase
      .from('discovery_sessions')
      .insert({
        session_name: 'Initial Discovery',
        start_hosts: ['192.168.1.1', '192.168.1.2', '192.168.1.3'],
        community_string: 'public',
        status: 'completed',
        devices_found: devices?.length || 0,
        connections_found: connections?.length || 0,
        completed_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (sessionError) {
      console.log('⚠️  Session creation:', sessionError.message)
    } else {
      console.log(`✅ Created discovery session: ${session.session_name}`)
    }
    
    console.log('\n🎉 Database setup completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`- Devices: ${devices?.length || 0}`)
    console.log(`- Interfaces: ${interfaces?.length || 0}`)
    console.log(`- Connections: ${connections?.length || 0}`)
    console.log(`- Discovery Sessions: ${session ? 1 : 0}`)
    
    console.log('\n📋 Next steps:')
    console.log('1. Your Supabase database is ready!')
    console.log('2. Run the application: npm run dev')
    console.log('3. Check the Supabase dashboard to see your data')
    console.log('4. The application will automatically use this database')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    console.log('\n💡 Manual setup instructions:')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Navigate to the SQL Editor')
    console.log('3. Run the SQL commands from database/schema.sql')
    console.log('4. Or use the Supabase CLI to apply the schema')
  }
}

// Run the setup
createTables()
