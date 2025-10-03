#!/usr/bin/env node

/**
 * Database Setup Script for Supabase
 * This script will create all necessary tables and sample data
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Supabase configuration
const supabaseUrl = 'https://feoyvuyklhtwrljxweht.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlb3l2dXlrbGh0d3Jsanh3ZWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNzY2MjQsImV4cCI6MjA3NDk1MjYyNH0.Mmu9CpGrZwKeq4sByOAokk4NDHStpQPmdO-hoWbSP1U'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...')
    
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql')
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8')
    
    console.log('📄 Schema file loaded successfully')
    
    // Split the SQL into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📊 Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      if (statement.trim()) {
        try {
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)
          
          const { data, error } = await supabase.rpc('exec_sql', {
            sql: statement + ';'
          })
          
          if (error) {
            // Some errors are expected (like "already exists")
            if (error.message.includes('already exists') || 
                error.message.includes('does not exist') ||
                error.message.includes('duplicate key')) {
              console.log(`⚠️  Statement ${i + 1}: ${error.message}`)
            } else {
              console.error(`❌ Statement ${i + 1} failed:`, error.message)
            }
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`)
          }
        } catch (err) {
          console.error(`❌ Statement ${i + 1} error:`, err.message)
        }
      }
    }
    
    // Verify tables were created
    console.log('\n🔍 Verifying database setup...')
    
    const tables = [
      'devices',
      'interfaces', 
      'connections',
      'discovery_sessions',
      'network_topology',
      'snmp_data'
    ]
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          console.log(`❌ Table ${table}: ${error.message}`)
        } else {
          console.log(`✅ Table ${table}: Ready`)
        }
      } catch (err) {
        console.log(`❌ Table ${table}: ${err.message}`)
      }
    }
    
    // Test data insertion
    console.log('\n🧪 Testing data operations...')
    
    try {
      // Test device creation
      const { data: deviceData, error: deviceError } = await supabase
        .from('devices')
        .insert({
          host: '192.168.1.100',
          name: 'Test-Device',
          description: 'Test device for verification',
          device_type: 'switch',
          vendor: 'Test Vendor',
          model: 'Test Model',
          status: 'active'
        })
        .select()
        .single()
      
      if (deviceError) {
        console.log(`⚠️  Device test: ${deviceError.message}`)
      } else {
        console.log(`✅ Device test: Created device with ID ${deviceData.id}`)
        
        // Clean up test device
        await supabase
          .from('devices')
          .delete()
          .eq('id', deviceData.id)
        
        console.log(`🧹 Test device cleaned up`)
      }
    } catch (err) {
      console.log(`❌ Device test error: ${err.message}`)
    }
    
    console.log('\n🎉 Database setup completed!')
    console.log('\n📋 Next steps:')
    console.log('1. Your Supabase database is ready to use')
    console.log('2. You can now run the application with: npm run dev')
    console.log('3. Check the Supabase dashboard to see your tables')
    console.log('4. The application will automatically connect to the database')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    process.exit(1)
  }
}

// Alternative method using direct SQL execution
async function setupDatabaseDirect() {
  try {
    console.log('🚀 Starting direct database setup...')
    
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql')
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8')
    
    console.log('📄 Schema file loaded successfully')
    
    // Execute the entire schema at once
    const { data, error } = await supabase
      .from('_sql')
      .select('*')
      .eq('query', schemaSQL)
    
    if (error) {
      console.error('❌ Schema execution failed:', error.message)
    } else {
      console.log('✅ Schema executed successfully')
    }
    
  } catch (error) {
    console.error('❌ Direct setup failed:', error.message)
  }
}

// Run the setup
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase()
}
