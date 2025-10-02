import React, { useState, useEffect } from 'react';

const Monitoring = () => {
  const [activeTab, setActiveTab] = useState('performance');
  const [realTimeData, setRealTimeData] = useState({
    bandwidth: 2.4,
    latency: 12,
    packetLoss: 0.01,
    uptime: 99.9
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        bandwidth: prev.bandwidth + (Math.random() - 0.5) * 0.2,
        latency: prev.latency + (Math.random() - 0.5) * 2,
        packetLoss: Math.max(0, prev.packetLoss + (Math.random() - 0.5) * 0.01),
        uptime: Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.1)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const performanceMetrics = [
    {
      name: 'Bandwidth Utilization',
      value: `${realTimeData.bandwidth.toFixed(1)} TB/s`,
      percentage: (realTimeData.bandwidth / 3) * 100,
      status: realTimeData.bandwidth > 2.5 ? 'warning' : 'good',
      trend: '+5.2%'
    },
    {
      name: 'Average Latency',
      value: `${realTimeData.latency.toFixed(1)} ms`,
      percentage: (realTimeData.latency / 50) * 100,
      status: realTimeData.latency > 20 ? 'warning' : 'good',
      trend: '-2.1%'
    },
    {
      name: 'Packet Loss',
      value: `${realTimeData.packetLoss.toFixed(3)}%`,
      percentage: (realTimeData.packetLoss / 0.1) * 100,
      status: realTimeData.packetLoss > 0.05 ? 'error' : 'good',
      trend: '+0.01%'
    },
    {
      name: 'Network Uptime',
      value: `${realTimeData.uptime.toFixed(2)}%`,
      percentage: realTimeData.uptime,
      status: realTimeData.uptime > 99.5 ? 'good' : 'warning',
      trend: '+0.1%'
    }
  ];

  const alerts = [
    {
      id: 1,
      severity: 'high',
      message: 'High latency detected on Route A-12',
      timestamp: '2024-01-15 14:30:25',
      node: 'Backbone Node A',
      status: 'active'
    },
    {
      id: 2,
      severity: 'medium',
      message: 'Bandwidth utilization above 80%',
      timestamp: '2024-01-15 14:25:10',
      node: 'Core Router 1',
      status: 'active'
    },
    {
      id: 3,
      severity: 'low',
      message: 'Scheduled maintenance window starting',
      timestamp: '2024-01-15 14:20:00',
      node: 'Edge Router 3',
      status: 'scheduled'
    },
    {
      id: 4,
      severity: 'high',
      message: 'Connection timeout to Peering Point 2',
      timestamp: '2024-01-15 14:15:45',
      node: 'Peering Point 2',
      status: 'resolved'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Network Monitoring</h1>
        <p className="mt-1 text-sm text-gray-500">
          Real-time monitoring of fiber optic network performance
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'performance', name: 'Performance Metrics' },
            { id: 'alerts', name: 'Alerts & Events' },
            { id: 'traffic', name: 'Traffic Analysis' },
            { id: 'health', name: 'System Health' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Performance Metrics Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Real-time Metrics */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {performanceMetrics.map((metric) => (
              <div key={metric.name} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{metric.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
                    <p className="text-sm text-gray-500">{metric.trend}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                      {metric.status}
                    </span>
                    <div className="mt-2 w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          metric.status === 'good' ? 'bg-green-500' :
                          metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, metric.percentage)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Performance Chart Placeholder */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Trends</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-500">Performance chart visualization would be integrated here</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Active Alerts</h3>
              <button className="btn-primary">Configure Alerts</button>
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.node} • {alert.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      alert.status === 'active' ? 'bg-red-100 text-red-800' :
                      alert.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.status}
                    </span>
                    <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Traffic Analysis Tab */}
      {activeTab === 'traffic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Traffic by Protocol</h3>
              <div className="space-y-3">
                {[
                  { protocol: 'HTTP/HTTPS', percentage: 45, color: 'bg-blue-500' },
                  { protocol: 'FTP', percentage: 20, color: 'bg-green-500' },
                  { protocol: 'SSH', percentage: 15, color: 'bg-purple-500' },
                  { protocol: 'DNS', percentage: 10, color: 'bg-yellow-500' },
                  { protocol: 'Other', percentage: 10, color: 'bg-gray-500' }
                ].map((item) => (
                  <div key={item.protocol} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.protocol}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Talkers</h3>
              <div className="space-y-3">
                {[
                  { ip: '192.168.1.100', traffic: '2.4 TB', percentage: 35 },
                  { ip: '192.168.1.101', traffic: '1.8 TB', percentage: 28 },
                  { ip: '192.168.1.102', traffic: '1.2 TB', percentage: 18 },
                  { ip: '192.168.1.103', traffic: '0.9 TB', percentage: 14 },
                  { ip: '192.168.1.104', traffic: '0.5 TB', percentage: 5 }
                ].map((item) => (
                  <div key={item.ip} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.ip}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{item.traffic}</span>
                      <span className="text-xs text-gray-500">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Health Tab */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {[
              { name: 'Core Routers', status: 'healthy', uptime: '99.9%', issues: 0 },
              { name: 'Backbone Nodes', status: 'healthy', uptime: '99.8%', issues: 1 },
              { name: 'Edge Routers', status: 'warning', uptime: '99.5%', issues: 2 }
            ].map((system) => (
              <div key={system.name} className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{system.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(system.status)}`}>
                    {system.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Uptime</span>
                    <span className="text-sm font-medium text-gray-900">{system.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Issues</span>
                    <span className="text-sm font-medium text-gray-900">{system.issues}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Monitoring;
