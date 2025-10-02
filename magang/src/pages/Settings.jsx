import React, { useState } from 'react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Fiber Network Topology',
      timezone: 'UTC+7',
      language: 'en',
      theme: 'light'
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      maintenanceNotifications: true,
      performanceAlerts: true,
      securityAlerts: true
    },
    monitoring: {
      pollingInterval: 30,
      alertThreshold: 80,
      retentionPeriod: 90,
      autoBackup: true
    },
    security: {
      sessionTimeout: 60,
      twoFactorAuth: false,
      ipWhitelist: '',
      passwordPolicy: 'strong'
    },
    snmp: {
      defaultCommunity: 'public',
      timeout: 5000,
      retries: 3,
      pollingInterval: 30,
      enableLLDP: true,
      enableCDP: true,
      autoDiscovery: false,
      discoveryInterval: 300
    }
  });

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const saveSettings = () => {
    // Simulate saving settings
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure system settings and preferences
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'general', name: 'General' },
            { id: 'notifications', name: 'Notifications' },
            { id: 'monitoring', name: 'Monitoring' },
            { id: 'security', name: 'Security' },
            { id: 'snmp', name: 'SNMP' }
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

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                <input
                  type="text"
                  value={settings.general.siteName}
                  onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  value={settings.general.timezone}
                  onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="UTC+7">UTC+7 (Jakarta)</option>
                  <option value="UTC+8">UTC+8 (Singapore)</option>
                  <option value="UTC+9">UTC+9 (Tokyo)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={settings.general.language}
                  onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="en">English</option>
                  <option value="id">Bahasa Indonesia</option>
                  <option value="ja">日本語</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={settings.general.theme === 'light'}
                      onChange={(e) => handleSettingChange('general', 'theme', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Light</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={settings.general.theme === 'dark'}
                      onChange={(e) => handleSettingChange('general', 'theme', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Dark</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Settings */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Alerts</label>
                  <p className="text-xs text-gray-500">Receive alerts via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.emailAlerts}
                  onChange={(e) => handleSettingChange('notifications', 'emailAlerts', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">SMS Alerts</label>
                  <p className="text-xs text-gray-500">Receive alerts via SMS</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.smsAlerts}
                  onChange={(e) => handleSettingChange('notifications', 'smsAlerts', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Maintenance Notifications</label>
                  <p className="text-xs text-gray-500">Get notified about scheduled maintenance</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.maintenanceNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'maintenanceNotifications', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Performance Alerts</label>
                  <p className="text-xs text-gray-500">Get notified about performance issues</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.performanceAlerts}
                  onChange={(e) => handleSettingChange('notifications', 'performanceAlerts', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Security Alerts</label>
                  <p className="text-xs text-gray-500">Get notified about security events</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.securityAlerts}
                  onChange={(e) => handleSettingChange('notifications', 'securityAlerts', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monitoring Settings */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Monitoring Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Polling Interval (seconds)</label>
                <input
                  type="number"
                  value={settings.monitoring.pollingInterval}
                  onChange={(e) => handleSettingChange('monitoring', 'pollingInterval', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="10"
                  max="300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alert Threshold (%)</label>
                <input
                  type="number"
                  value={settings.monitoring.alertThreshold}
                  onChange={(e) => handleSettingChange('monitoring', 'alertThreshold', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="50"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention Period (days)</label>
                <input
                  type="number"
                  value={settings.monitoring.retentionPeriod}
                  onChange={(e) => handleSettingChange('monitoring', 'retentionPeriod', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="30"
                  max="365"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Automatic Backup</label>
                  <p className="text-xs text-gray-500">Enable automatic data backup</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.monitoring.autoBackup}
                  onChange={(e) => handleSettingChange('monitoring', 'autoBackup', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Security Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                <input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="15"
                  max="480"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Two-Factor Authentication</label>
                  <p className="text-xs text-gray-500">Enable 2FA for enhanced security</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IP Whitelist</label>
                <textarea
                  value={settings.security.ipWhitelist}
                  onChange={(e) => handleSettingChange('security', 'ipWhitelist', e.target.value)}
                  placeholder="Enter IP addresses separated by commas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password Policy</label>
                <select
                  value={settings.security.passwordPolicy}
                  onChange={(e) => handleSettingChange('security', 'passwordPolicy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="basic">Basic (8+ characters)</option>
                  <option value="strong">Strong (12+ characters, mixed case, numbers, symbols)</option>
                  <option value="enterprise">Enterprise (16+ characters, complex requirements)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SNMP Settings */}
      {activeTab === 'snmp' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SNMP Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Community String</label>
                <input
                  type="text"
                  value={settings.snmp.defaultCommunity}
                  onChange={(e) => handleSettingChange('snmp', 'defaultCommunity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="mt-1 text-xs text-gray-500">Default SNMP community string for device communication</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timeout (ms)</label>
                  <input
                    type="number"
                    value={settings.snmp.timeout}
                    onChange={(e) => handleSettingChange('snmp', 'timeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    min="1000"
                    max="30000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Retries</label>
                  <input
                    type="number"
                    value={settings.snmp.retries}
                    onChange={(e) => handleSettingChange('snmp', 'retries', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Polling Interval (seconds)</label>
                <input
                  type="number"
                  value={settings.snmp.pollingInterval}
                  onChange={(e) => handleSettingChange('snmp', 'pollingInterval', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="10"
                  max="300"
                />
                <p className="mt-1 text-xs text-gray-500">How often to poll devices for status updates</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-md font-medium text-gray-900">Discovery Protocols</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Enable LLDP Discovery</label>
                    <p className="text-xs text-gray-500">Use Link Layer Discovery Protocol for neighbor discovery</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.snmp.enableLLDP}
                    onChange={(e) => handleSettingChange('snmp', 'enableLLDP', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Enable CDP Discovery</label>
                    <p className="text-xs text-gray-500">Use Cisco Discovery Protocol for neighbor discovery</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.snmp.enableCDP}
                    onChange={(e) => handleSettingChange('snmp', 'enableCDP', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-md font-medium text-gray-900">Auto Discovery</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Enable Auto Discovery</label>
                    <p className="text-xs text-gray-500">Automatically discover new devices in the network</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.snmp.autoDiscovery}
                    onChange={(e) => handleSettingChange('snmp', 'autoDiscovery', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>

                {settings.snmp.autoDiscovery && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discovery Interval (seconds)</label>
                    <input
                      type="number"
                      value={settings.snmp.discoveryInterval}
                      onChange={(e) => handleSettingChange('snmp', 'discoveryInterval', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      min="60"
                      max="3600"
                    />
                    <p className="mt-1 text-xs text-gray-500">How often to run automatic network discovery</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SNMP Test Section */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SNMP Test</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Test Host</label>
                <input
                  type="text"
                  placeholder="192.168.1.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <button className="btn-primary">Test SNMP Connection</button>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={saveSettings} className="btn-primary">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
