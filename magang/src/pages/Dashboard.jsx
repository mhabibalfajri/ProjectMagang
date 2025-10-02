import React from 'react';
import '../index.css';

const Dashboard = () => {
  const stats = [
    {
      name: 'Total Fiber Routes',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      name: 'Active Connections',
      value: '8,934',
      change: '+5%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: 'Network Uptime',
      value: '99.9%',
      change: '+0.1%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'Bandwidth Usage',
      value: '2.4 TB/s',
      change: '+8%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'High latency detected on Route A-12',
      time: '2 minutes ago',
    },
    {
      id: 2,
      type: 'info',
      message: 'Scheduled maintenance completed on Node B-5',
      time: '1 hour ago',
    },
    {
      id: 3,
      type: 'success',
      message: 'New fiber route activated: C-8 to D-3',
      time: '3 hours ago',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your fiber optic network infrastructure
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card kpi-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                  {stat.icon}
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Network Overview */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Network Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Primary Backbone</span>
              <span className="text-sm font-medium text-green-600">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Secondary Routes</span>
              <span className="text-sm font-medium text-green-600">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Edge Connections</span>
              <span className="text-sm font-medium text-yellow-600">Maintenance</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Peering Points</span>
              <span className="text-sm font-medium text-green-600">Operational</span>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                  alert.type === 'warning' ? 'bg-yellow-400' :
                  alert.type === 'error' ? 'bg-red-400' :
                  alert.type === 'success' ? 'bg-green-400' : 'bg-blue-400'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="btn-primary">
            View Network Topology
          </button>
          <button className="btn-secondary">
            Generate Report
          </button>
          <button className="btn-secondary">
            Check System Status
          </button>
          <button className="btn-secondary">
            Schedule Maintenance
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
