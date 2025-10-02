const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Network Topology Development Environment...\n');

// Start backend server
console.log('📡 Starting SNMP Backend Server...');
const backend = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

backend.on('error', (error) => {
  console.error('❌ Backend server error:', error);
});

backend.on('close', (code) => {
  console.log(`📡 Backend server exited with code ${code}`);
});

// Wait a bit for backend to start
setTimeout(() => {
  // Start frontend development server
  console.log('🌐 Starting Frontend Development Server...');
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  frontend.on('error', (error) => {
    console.error('❌ Frontend server error:', error);
  });

  frontend.on('close', (code) => {
    console.log(`🌐 Frontend server exited with code ${code}`);
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    backend.kill();
    frontend.kill();
    process.exit(0);
  });

}, 2000);

console.log('✅ Development environment started!');
console.log('📡 Backend API: http://localhost:3001');
console.log('🌐 Frontend: http://localhost:5173');
console.log('📋 Press Ctrl+C to stop all servers\n');
