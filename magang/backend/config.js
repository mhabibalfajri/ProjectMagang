/**
 * SNMP Backend Configuration
 */

export const config = {
  // Server settings
  port: process.env.PORT || 3001,
  
  // SNMP settings
  snmp: {
    defaultCommunity: process.env.DEFAULT_COMMUNITY || 'public',
    defaultVersion: process.env.DEFAULT_VERSION || 2,
    defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT) || 5000,
    defaultRetries: parseInt(process.env.DEFAULT_RETRIES) || 3,
    port: 161,
    trapPort: 162
  },
  
  // WebSocket settings
  websocket: {
    heartbeatInterval: parseInt(process.env.WS_HEARTBEAT_INTERVAL) || 30000,
    reconnectDelay: parseInt(process.env.WS_RECONNECT_DELAY) || 5000
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    logSnmpRequests: process.env.LOG_SNMP_REQUESTS === 'true'
  },
  
  // Security
  security: {
    apiKey: process.env.API_KEY || null,
    allowedOrigins: process.env.ALLOWED_ORIGINS ? 
      process.env.ALLOWED_ORIGINS.split(',') : 
      ['http://localhost:5173', 'http://localhost:3000']
  }
};
