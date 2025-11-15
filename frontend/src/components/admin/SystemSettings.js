import React, { useState, useEffect } from 'react';

const SystemSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('general');
  const [saved, setSaved] = useState(false);

  // Sample settings data
  const sampleSettings = {
    general: {
      siteName: "Lab Management System",
      siteDescription: "University Laboratory Booking and Management Platform",
      timezone: "Asia/Jakarta",
      language: "id",
      dateFormat: "DD/MM/YYYY",
      maxBookingDays: 30,
      autoLogout: 60
    },
    booking: {
      maxParticipants: 50,
      minBookingNotice: 24,
      maxBookingDuration: 4,
      allowWeekendBookings: true,
      approvalRequired: true,
      cancellationDeadline: 48,
      bufferTime: 30
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      bookingConfirmation: true,
      bookingReminder: true,
      adminAlerts: true,
      maintenanceAlerts: true,
      dailyDigest: false
    },
    security: {
      requireStrongPassword: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      twoFactorAuth: false,
      ipWhitelist: "",
      auditLog: true
    },
    integration: {
      calendarSync: true,
      googleCalendar: false,
      outlookCalendar: true,
      apiEnabled: true,
      webhookUrl: "",
      backupFrequency: "daily"
    },
    appearance: {
      theme: "light",
      primaryColor: "#3B82F6",
      sidebarStyle: "expanded",
      dashboardLayout: "grid",
      fontFamily: "Inter"
    }
  };

  useEffect(() => {
    // Simulate API call to load settings
    const timer = setTimeout(() => {
      setSettings(sampleSettings);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSaveSettings = () => {
    // Simulate API call to save settings
    console.log('Saving settings:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      setSettings(sampleSettings);
      console.log('Settings reset to default');
    }
  };

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const settingsSections = [
    { id: 'general', name: 'General', icon: '⚙️', description: 'Basic system configuration' },
    { id: 'booking', name: 'Booking', icon: '📅', description: 'Booking rules and limits' },
    { id: 'notifications', name: 'Notifications', icon: '🔔', description: 'Email and alert settings' },
    { id: 'security', name: 'Security', icon: '🔒', description: 'Security and access control' },
    { id: 'integration', name: 'Integration', icon: '🔄', description: 'Third-party integrations' },
    { id: 'appearance', name: 'Appearance', icon: '🎨', description: 'UI and theme settings' }
  ];

  const renderSettingControl = (section, key, value, type = 'text') => {
    switch (type) {
      case 'boolean':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleSettingChange(section, key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        );
      
      case 'select':
        const options = getSelectOptions(section, key);
        return (
          <select
            value={value}
            onChange={(e) => handleSettingChange(section, key, e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleSettingChange(section, key, parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleSettingChange(section, key, e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
    }
  };

  const getSelectOptions = (section, key) => {
    const options = {
      timezone: [
        { value: 'Asia/Jakarta', label: 'Jakarta (WIB)' },
        { value: 'Asia/Makassar', label: 'Makassar (WITA)' },
        { value: 'Asia/Jayapura', label: 'Jayapura (WIT)' },
        { value: 'UTC', label: 'UTC' }
      ],
      language: [
        { value: 'id', label: 'Indonesian' },
        { value: 'en', label: 'English' }
      ],
      dateFormat: [
        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
        { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
      ],
      backupFrequency: [
        { value: 'hourly', label: 'Hourly' },
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' }
      ],
      theme: [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'auto', label: 'Auto' }
      ],
      sidebarStyle: [
        { value: 'expanded', label: 'Expanded' },
        { value: 'collapsed', label: 'Collapsed' },
        { value: 'hidden', label: 'Hidden' }
      ],
      dashboardLayout: [
        { value: 'grid', label: 'Grid' },
        { value: 'list', label: 'List' },
        { value: 'compact', label: 'Compact' }
      ],
      fontFamily: [
        { value: 'Inter', label: 'Inter' },
        { value: 'Roboto', label: 'Roboto' },
        { value: 'Arial', label: 'Arial' },
        { value: 'Georgia', label: 'Georgia' }
      ]
    };

    return options[key] || [{ value: '', label: 'Select...' }];
  };

  const getSettingConfig = (section, key) => {
    const configs = {
      general: {
        siteName: { label: 'Site Name', type: 'text', description: 'The name of your lab management system' },
        siteDescription: { label: 'Site Description', type: 'text', description: 'A brief description of your platform' },
        timezone: { label: 'Timezone', type: 'select', description: 'Default timezone for the system' },
        language: { label: 'Language', type: 'select', description: 'Default language for the interface' },
        dateFormat: { label: 'Date Format', type: 'select', description: 'Preferred date format' },
        maxBookingDays: { label: 'Max Booking Days Ahead', type: 'number', description: 'Maximum days in advance a booking can be made' },
        autoLogout: { label: 'Auto Logout (minutes)', type: 'number', description: 'Automatic logout after inactivity' }
      },
      booking: {
        maxParticipants: { label: 'Maximum Participants', type: 'number', description: 'Maximum number of participants per booking' },
        minBookingNotice: { label: 'Minimum Booking Notice (hours)', type: 'number', description: 'Minimum time required before a booking starts' },
        maxBookingDuration: { label: 'Maximum Booking Duration (hours)', type: 'number', description: 'Maximum duration for a single booking' },
        allowWeekendBookings: { label: 'Allow Weekend Bookings', type: 'boolean', description: 'Enable bookings on Saturdays and Sundays' },
        approvalRequired: { label: 'Approval Required', type: 'boolean', description: 'Require admin approval for all bookings' },
        cancellationDeadline: { label: 'Cancellation Deadline (hours)', type: 'number', description: 'Time before booking when cancellation is allowed' },
        bufferTime: { label: 'Buffer Time (minutes)', type: 'number', description: 'Time between consecutive bookings' }
      },
      notifications: {
        emailNotifications: { label: 'Email Notifications', type: 'boolean', description: 'Enable email notifications' },
        smsNotifications: { label: 'SMS Notifications', type: 'boolean', description: 'Enable SMS notifications' },
        bookingConfirmation: { label: 'Booking Confirmations', type: 'boolean', description: 'Send booking confirmation emails' },
        bookingReminder: { label: 'Booking Reminders', type: 'boolean', description: 'Send reminder notifications before bookings' },
        adminAlerts: { label: 'Admin Alerts', type: 'boolean', description: 'Send alerts to administrators' },
        maintenanceAlerts: { label: 'Maintenance Alerts', type: 'boolean', description: 'Notify users about maintenance' },
        dailyDigest: { label: 'Daily Digest', type: 'boolean', description: 'Send daily summary emails' }
      },
      security: {
        requireStrongPassword: { label: 'Require Strong Passwords', type: 'boolean', description: 'Enforce strong password policies' },
        sessionTimeout: { label: 'Session Timeout (minutes)', type: 'number', description: 'User session timeout duration' },
        maxLoginAttempts: { label: 'Max Login Attempts', type: 'number', description: 'Maximum failed login attempts before lockout' },
        twoFactorAuth: { label: 'Two-Factor Authentication', type: 'boolean', description: 'Enable 2FA for all users' },
        ipWhitelist: { label: 'IP Whitelist', type: 'text', description: 'Comma-separated list of allowed IP addresses' },
        auditLog: { label: 'Audit Log', type: 'boolean', description: 'Log all system activities' }
      },
      integration: {
        calendarSync: { label: 'Calendar Sync', type: 'boolean', description: 'Enable calendar synchronization' },
        googleCalendar: { label: 'Google Calendar', type: 'boolean', description: 'Integrate with Google Calendar' },
        outlookCalendar: { label: 'Outlook Calendar', type: 'boolean', description: 'Integrate with Outlook Calendar' },
        apiEnabled: { label: 'API Access', type: 'boolean', description: 'Enable REST API access' },
        webhookUrl: { label: 'Webhook URL', type: 'text', description: 'URL for sending webhook notifications' },
        backupFrequency: { label: 'Backup Frequency', type: 'select', description: 'How often to backup system data' }
      },
      appearance: {
        theme: { label: 'Theme', type: 'select', description: 'Default color theme' },
        primaryColor: { label: 'Primary Color', type: 'text', description: 'Main brand color (hex code)' },
        sidebarStyle: { label: 'Sidebar Style', type: 'select', description: 'Navigation sidebar behavior' },
        dashboardLayout: { label: 'Dashboard Layout', type: 'select', description: 'Default dashboard layout' },
        fontFamily: { label: 'Font Family', type: 'select', description: 'Default font for the interface' }
      }
    };

    return configs[section]?.[key] || { label: key, type: 'text', description: '' };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
          <p className="text-gray-600 mt-1">Configure system preferences and behavior</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <button 
            onClick={handleResetSettings}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset to Default
          </button>
          <button 
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-lg">✅</span>
            <div>
              <p className="font-semibold text-green-800">Settings Saved Successfully</p>
              <p className="text-green-700 text-sm">Your changes have been applied to the system.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Configuration Sections</h3>
            <nav className="space-y-2">
              {settingsSections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{section.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{section.name}</p>
                      <p className="text-xs opacity-75">{section.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {settingsSections.find(s => s.id === activeSection)?.name} Settings
            </h3>

            <div className="space-y-6">
              {settings[activeSection] && Object.entries(settings[activeSection]).map(([key, value]) => {
                const config = getSettingConfig(activeSection, key);
                return (
                  <div key={key} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          {config.label}
                        </label>
                        <p className="text-sm text-gray-600">
                          {config.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {renderSettingControl(activeSection, key, value, config.type)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Information */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-4">System Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-700"><strong>Version:</strong> 2.1.0</p>
                <p className="text-blue-700"><strong>Last Updated:</strong> January 20, 2024</p>
              </div>
              <div>
                <p className="text-blue-700"><strong>Database:</strong> MongoDB 6.0</p>
                <p className="text-blue-700"><strong>Environment:</strong> Production</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-8 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-4">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Clear All Data</p>
              <p className="text-sm text-gray-600">Permanently delete all bookings, users, and system data</p>
            </div>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Clear Data
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Export System Data</p>
              <p className="text-sm text-gray-600">Download complete system backup</p>
            </div>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              Export Backup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;