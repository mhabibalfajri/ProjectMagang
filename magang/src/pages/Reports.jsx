import React, { useState } from 'react';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('network-performance');
  const [dateRange, setDateRange] = useState('7d');

  const reportTypes = [
    {
      id: 'network-performance',
      name: 'Network Performance',
      description: 'Bandwidth utilization, latency, and throughput analysis',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'traffic-analysis',
      name: 'Traffic Analysis',
      description: 'Network traffic patterns and protocol distribution',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      )
    },
    {
      id: 'uptime-report',
      name: 'Uptime Report',
      description: 'System availability and downtime analysis',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'security-audit',
      name: 'Security Audit',
      description: 'Security events and threat analysis',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 'capacity-planning',
      name: 'Capacity Planning',
      description: 'Resource utilization and growth projections',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      id: 'maintenance-log',
      name: 'Maintenance Log',
      description: 'Scheduled maintenance and incident reports',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    }
  ];

  const recentReports = [
    {
      id: 1,
      name: 'Weekly Network Performance Report',
      type: 'network-performance',
      generated: '2024-01-15 09:00:00',
      status: 'completed',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'Monthly Traffic Analysis',
      type: 'traffic-analysis',
      generated: '2024-01-14 23:30:00',
      status: 'completed',
      size: '5.1 MB'
    },
    {
      id: 3,
      name: 'Security Audit Report',
      type: 'security-audit',
      generated: '2024-01-14 18:00:00',
      status: 'completed',
      size: '1.8 MB'
    },
    {
      id: 4,
      name: 'Q4 Uptime Summary',
      type: 'uptime-report',
      generated: '2024-01-13 12:00:00',
      status: 'completed',
      size: '3.2 MB'
    }
  ];

  const generateReport = () => {
    // Simulate report generation
    alert(`Generating ${reportTypes.find(r => r.id === selectedReport)?.name} report for ${dateRange}...`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="mt-1 text-sm text-gray-500">
          Generate and manage network performance reports
        </p>
      </div>

      {/* Report Generation */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Generate New Report</h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Report Type</label>
            <div className="space-y-2">
              {reportTypes.map((report) => (
                <div
                  key={report.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedReport === report.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedReport(report.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      selectedReport === report.id ? 'text-primary-600' : 'text-gray-400'
                    }`}>
                      {report.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{report.name}</p>
                      <p className="text-xs text-gray-500">{report.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report Configuration */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="1d">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="format" value="pdf" defaultChecked className="mr-2" />
                  <span className="text-sm text-gray-700">PDF Document</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="format" value="excel" className="mr-2" />
                  <span className="text-sm text-gray-700">Excel Spreadsheet</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="format" value="csv" className="mr-2" />
                  <span className="text-sm text-gray-700">CSV Data</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Delivery</label>
              <input
                type="email"
                placeholder="admin@company.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <button
              onClick={generateReport}
              className="w-full btn-primary"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Reports</h3>
          <button className="btn-secondary">View All Reports</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{report.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {reportTypes.find(t => t.id === report.type)?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{report.generated}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{report.size}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">Download</button>
                      <button className="text-gray-600 hover:text-gray-900">View</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Templates */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Report Templates</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Executive Summary', description: 'High-level overview for management' },
            { name: 'Technical Deep Dive', description: 'Detailed technical analysis' },
            { name: 'Compliance Report', description: 'Regulatory compliance documentation' },
            { name: 'Performance Benchmark', description: 'Industry comparison metrics' },
            { name: 'Cost Analysis', description: 'Network cost breakdown and optimization' },
            { name: 'Disaster Recovery', description: 'Backup and recovery procedures' }
          ].map((template) => (
            <div key={template.name} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200">
              <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
              <p className="text-xs text-gray-500 mt-1">{template.description}</p>
              <button className="mt-2 text-xs text-primary-600 hover:text-primary-800 font-medium">
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
