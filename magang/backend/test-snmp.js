#!/usr/bin/env node

/**
 * Test SNMP Backend Server
 * Script untuk testing koneksi SNMP ke switch
 */

import snmp from 'net-snmp';

// Test configuration
const TEST_HOSTS = [
  { host: '192.168.1.1', community: 'public', name: 'Core Switch' },
  { host: '192.168.1.2', community: 'public', name: 'Access Switch' },
  { host: '10.0.0.1', community: 'public', name: 'Router' }
];

/**
 * Test SNMP connection ke single host
 */
async function testSNMPConnection(hostConfig) {
  const { host, community, name } = hostConfig;
  
  console.log(`\n🧪 Testing SNMP connection to ${name} (${host})...`);
  
  try {
    // Create SNMP session
    const session = snmp.createSession(host, community, {
      port: 161,
      retries: 3,
      timeout: 5000,
      transport: 'udp4',
      version: snmp.Version2c,
      idBitsSize: 32
    });
    
    console.log(`✅ SNMP session created for ${host}`);
    
    // Test basic connectivity dengan sysDescr
    const oids = [
      '1.3.6.1.2.1.1.1.0', // sysDescr
      '1.3.6.1.2.1.1.5.0', // sysName
      '1.3.6.1.2.1.1.3.0'  // sysUpTime
    ];
    
    session.get(oids, (varbinds) => {
      console.log(`📊 System Information for ${name}:`);
      console.log(`   Description: ${varbinds[0].value.toString()}`);
      console.log(`   Name: ${varbinds[1].value.toString()}`);
      console.log(`   Uptime: ${varbinds[2].value.toString()}`);
      console.log(`✅ SNMP test successful for ${host}`);
      
      // Test interface count
      testInterfaceCount(session, host, name);
    });
    
  } catch (error) {
    console.error(`❌ SNMP test failed for ${host}:`, error.message);
  }
}

/**
 * Test interface count
 */
function testInterfaceCount(session, host, name) {
  console.log(`🔍 Getting interface count for ${name}...`);
  
  session.subtree('1.3.6.1.2.1.2.2.1.2', (varbinds) => {
    const interfaceCount = varbinds.length;
    console.log(`📡 Found ${interfaceCount} interfaces on ${name}`);
    
    if (interfaceCount > 0) {
      console.log(`✅ Interface discovery successful for ${host}`);
    } else {
      console.log(`⚠️  No interfaces found on ${host}`);
    }
    
    session.close();
  });
}

/**
 * Test semua hosts
 */
async function testAllHosts() {
  console.log('🚀 Starting SNMP Backend Test...');
  console.log('📋 Testing multiple network devices...');
  
  for (const hostConfig of TEST_HOSTS) {
    await testSNMPConnection(hostConfig);
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🎉 SNMP Backend Test completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Start the backend server: npm start');
  console.log('2. Test the API endpoints');
  console.log('3. Connect frontend to backend');
}

/**
 * Test specific host
 */
async function testSpecificHost(host, community = 'public') {
  console.log(`🧪 Testing specific host: ${host}`);
  
  const hostConfig = { host, community, name: 'Test Device' };
  await testSNMPConnection(hostConfig);
}

// Main execution
const args = process.argv.slice(2);

if (args.length > 0) {
  // Test specific host
  const host = args[0];
  const community = args[1] || 'public';
  testSpecificHost(host, community);
} else {
  // Test all hosts
  testAllHosts();
}
