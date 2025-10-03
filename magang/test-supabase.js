#!/usr/bin/env node

/**
 * Simple Supabase Connection Test
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://feoyvuyklhtwrljxweht.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlb3l2dXlrbGh0d3Jsanh3ZWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNzY2MjQsImV4cCI6MjA3NDk1MjYyNH0.Mmu9CpGrZwKeq4sByOAokk4NDHStpQPmdO-hoWbSP1U'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSupabaseConnection() {
  console.log('🚀 Testing Supabase connection...')
  
  try {
    // Test basic connection
    console.log('📡 Testing basic connection...')
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .limit(1)
    
    if (error && error.code === 'PGRST116') {
      console.log('✅ Connection successful! Tables do not exist yet.')
      console.log('📋 You need to create the tables manually in Supabase dashboard.')
    } else if (error) {
      console.log('⚠️  Connection warning:', error.message)
    } else {
      console.log('✅ Connection successful! Found existing data.')
    }
    
    // Test inserting sample data
    console.log('\n🧪 Testing data insertion...')
    
    const sampleDevice = {
      host: '192.168.1.100',
      name: 'Test-Device',
      description: 'Test device for connection verification',
      device_type: 'switch',
      vendor: 'Test Vendor',
      model: 'Test Model',
      status: 'active'
    }
    
    const { data: deviceData, error: deviceError } = await supabase
      .from('devices')
      .insert([sampleDevice])
      .select()
      .single()
    
    if (deviceError) {
      console.log('⚠️  Device insertion:', deviceError.message)
    } else {
      console.log('✅ Device inserted successfully:', deviceData.id)
      
      // Clean up test data
      await supabase
        .from('devices')
        .delete()
        .eq('id', deviceData.id)
      
      console.log('🧹 Test device cleaned up')
    }
    
    console.log('\n🎉 Supabase connection test completed!')
    console.log('\n📋 Next steps:')
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard')
    console.log('2. Navigate to your project: feoyvuyklhtwrljxweht')
    console.log('3. Go to SQL Editor')
    console.log('4. Run the SQL commands from database/schema.sql')
    console.log('5. Or use the Supabase CLI to apply the schema')
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    console.log('\n💡 Troubleshooting:')
    console.log('1. Check your internet connection')
    console.log('2. Verify the Supabase URL and API key')
    console.log('3. Make sure your Supabase project is active')
  }
}

// Run the test
testSupabaseConnection()
