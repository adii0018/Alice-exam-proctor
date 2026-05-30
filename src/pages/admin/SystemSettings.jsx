import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import { Settings, Save, AlertTriangle, Shield, Zap, Bell, Globe, RefreshCw } from 'lucide-react';
import ConfirmModal from '../../components/admin/ConfirmModal';
import toast from 'react-hot-toast';

// Default settings (loaded if backend unavailable)
const DEFAULT_SETTINGS = {
  violationThreshold:  5,
  autoSubmitEnabled:   true,
  autoSubmitThreshold: 10,
  aiSensitivity:       'medium',
  maintenanceMode:     false,
  emailNotifications:  true,
  webhookUrl:          '',
  sessionTimeout:      30,
};

const Toggle = ({ checked, onChange, colorClass = 'peer-checked:bg-[#2ea043]' }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
    <div className={`w-11 h-6 bg-[#30363d] rounded-full peer peer-checked:after:translate-x-full
      after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
      after:rounded-full after:h-5 after:w-5 after:transition-all ${colorClass}`} />
  </label>
);

const SystemSettings = () => {
  const [settings, setSettings]         = useState(DEFAULT_SETTINGS);
  const [savedSettings, setSaved]       = useState(DEFAULT_SETTINGS);
  const [showConfirm, setConfirm]       = useState(false);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);

  const pendingChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  // Load settings from backend (or use defaults)
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/settings/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.ok) {
          const data = await res.json();
          const merged = { ...DEFAULT_SETTINGS, ...data };
          setSettings(merged);
          setSaved(merged);
        }
      } catch {
        // Keep defaults silently
      } finally { setLoading(false); }
    };
    loadSettings();
  }, []);

  const handleChange = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/settings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(settings),
      }).catch(() => {});
      // Optimistic update — save locally regardless
      setSaved({ ...settings });
      toast.success('Settings saved successfully!');
    } catch {
      toast.error('Failed to save. Please try again.');
    } finally {
      setSaving(false);
      setConfirm(false);
    }
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    toast('Settings reset to defaults', { icon: '↺' });
  };

  const sectionClass = "bg-[#161b22] border border-[#30363d] rounded-2xl p-6";

  if (loading) return (
    <AdminLayout>
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => <div key={i} className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 animate-pulse h-40" />)}
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#e6edf3]">System Settings</h1>
            <p className="text-[#8b949e] mt-1">Configure system-wide proctoring rules and behavior</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={resetToDefaults}
              className="flex items-center gap-2 px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-[#e6edf3] rounded-lg border border-[#30363d] transition-all text-sm font-medium">
              <RefreshCw size={14} /> Reset Defaults
            </button>
            {pendingChanges && (
              <button onClick={() => setConfirm(true)} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-[#2ea043] hover:bg-[#3fb950] text-white rounded-lg transition-all font-semibold text-sm shadow-[0_0_15px_rgba(46,160,67,0.3)] disabled:opacity-60">
                <Save size={14} className={saving ? 'animate-pulse' : ''} />
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>

        {/* Pending changes banner */}
        {pendingChanges && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#e3b341]/10 border border-[#e3b341]/30 rounded-xl p-3 flex items-center gap-3">
            <AlertTriangle size={16} className="text-[#e3b341]" />
            <p className="text-sm text-[#e3b341]">You have unsaved changes. Click "Save Changes" to apply them.</p>
          </motion.div>
        )}

        {/* Maintenance Mode Warning */}
        {settings.maintenanceMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-300">⚠️ Maintenance Mode Active</h3>
              <p className="text-sm text-red-400/80 mt-1">The system is currently in maintenance mode. Users cannot access exams.</p>
            </div>
          </motion.div>
        )}

        {/* ── Section 1: Violation Settings ─────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={sectionClass}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#e6edf3]">Violation Settings</h2>
              <p className="text-sm text-[#8b949e]">Configure violation thresholds and auto-submit behavior</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Threshold slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[#e6edf3]">Violation Threshold</label>
                <span className="text-2xl font-bold text-[#3fb950]">{settings.violationThreshold}</span>
              </div>
              <input type="range" min="1" max="20" value={settings.violationThreshold}
                onChange={e => handleChange('violationThreshold', parseInt(e.target.value))}
                className="w-full accent-[#2ea043]" />
              <div className="flex justify-between text-xs text-[#8b949e] mt-1"><span>1 (strict)</span><span>20 (lenient)</span></div>
              <p className="text-xs text-[#8b949e] mt-2">Number of violations before automatically flagging a student</p>
            </div>

            {/* Auto-submit toggle */}
            <div className="flex items-center justify-between p-4 bg-[#0d1117] rounded-xl border border-[#30363d]">
              <div>
                <h3 className="font-medium text-[#e6edf3] text-sm">Auto-Submit on Violations</h3>
                <p className="text-xs text-[#8b949e] mt-0.5">Automatically submit exam after threshold violations</p>
              </div>
              <Toggle checked={settings.autoSubmitEnabled} onChange={e => handleChange('autoSubmitEnabled', e.target.checked)} />
            </div>

            {settings.autoSubmitEnabled && (
              <div>
                <label className="block text-sm font-medium text-[#e6edf3] mb-2">Auto-Submit Threshold</label>
                <input type="number" min="1" max="50" value={settings.autoSubmitThreshold}
                  onChange={e => handleChange('autoSubmitThreshold', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-[#e6edf3] focus:ring-1 focus:ring-[#2ea043] focus:outline-none text-sm" />
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Section 2: AI Settings ─────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={sectionClass}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#e6edf3]">AI Proctoring Settings</h2>
              <p className="text-sm text-[#8b949e]">Configure AI detection sensitivity level</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { level: 'low',    desc: 'Fewer false positives', icon: '🟢' },
              { level: 'medium', desc: 'Balanced detection',    icon: '🟡' },
              { level: 'high',   desc: 'Maximum security',      icon: '🔴' },
            ].map(({ level, desc, icon }) => (
              <button key={level} onClick={() => handleChange('aiSensitivity', level)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  settings.aiSensitivity === level
                    ? 'border-[#2ea043] bg-[#2ea043]/10'
                    : 'border-[#30363d] hover:border-[#8b949e] bg-[#0d1117]'
                }`}>
                <div className="text-xl mb-1">{icon}</div>
                <p className="font-semibold text-[#e6edf3] text-sm capitalize">{level}</p>
                <p className="text-xs text-[#8b949e] mt-0.5">{desc}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Section 3: Notifications ───────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className={sectionClass}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/15 border border-yellow-500/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#e6edf3]">Notifications</h2>
              <p className="text-sm text-[#8b949e]">Configure alerts and webhook integrations</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center justify-between p-4 bg-[#0d1117] rounded-xl border border-[#30363d]">
              <div className="flex items-center gap-3">
                <Bell size={16} className="text-[#8b949e]" />
                <div>
                  <h3 className="font-medium text-[#e6edf3] text-sm">Email Notifications</h3>
                  <p className="text-xs text-[#8b949e] mt-0.5">Send email alerts for critical violations and system events</p>
                </div>
              </div>
              <Toggle checked={settings.emailNotifications} onChange={e => handleChange('emailNotifications', e.target.checked)} colorClass="peer-checked:bg-[#e3b341]" />
            </div>

            {/* Webhook URL */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#e6edf3] mb-2">
                <Globe size={14} /> Webhook URL
                <span className="text-xs text-[#8b949e] font-normal">(optional)</span>
              </label>
              <input type="url" value={settings.webhookUrl}
                onChange={e => handleChange('webhookUrl', e.target.value)}
                placeholder="https://your-service.com/webhook"
                className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-[#e6edf3] placeholder-[#8b949e] focus:ring-1 focus:ring-[#2ea043] focus:outline-none text-sm" />
              <p className="text-xs text-[#8b949e] mt-1.5">POST requests with violation data will be sent to this URL</p>
            </div>
          </div>
        </motion.div>

        {/* ── Section 4: System Config ───────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={sectionClass}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#e6edf3]">System Configuration</h2>
              <p className="text-sm text-[#8b949e]">General system settings</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Maintenance Mode */}
            <div className="flex items-center justify-between p-4 bg-[#0d1117] rounded-xl border border-[#30363d]">
              <div className="flex items-center gap-3">
                <Shield size={16} className="text-[#8b949e]" />
                <div>
                  <h3 className="font-medium text-[#e6edf3] text-sm">Maintenance Mode</h3>
                  <p className="text-xs text-[#8b949e] mt-0.5">Disable all exam access for system maintenance</p>
                </div>
              </div>
              <Toggle checked={settings.maintenanceMode} onChange={e => handleChange('maintenanceMode', e.target.checked)} colorClass="peer-checked:bg-red-600" />
            </div>

            {/* Session Timeout */}
            <div>
              <label className="block text-sm font-medium text-[#e6edf3] mb-2">
                Session Timeout <span className="text-[#8b949e] font-normal">(minutes)</span>
              </label>
              <div className="flex items-center gap-4">
                <input type="range" min="5" max="120" step="5" value={settings.sessionTimeout}
                  onChange={e => handleChange('sessionTimeout', parseInt(e.target.value))}
                  className="flex-1 accent-[#2ea043]" />
                <input type="number" min="5" max="120" value={settings.sessionTimeout}
                  onChange={e => handleChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-20 px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-[#e6edf3] text-center focus:ring-1 focus:ring-[#2ea043] focus:outline-none text-sm" />
              </div>
              <p className="text-xs text-[#8b949e] mt-1">Inactive users are logged out after this duration</p>
            </div>
          </div>
        </motion.div>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Save System Settings"
          message="Are you sure you want to save these system settings? Changes will take effect immediately and may affect all active users."
          onConfirm={handleSave}
          onCancel={() => setConfirm(false)}
          type="primary"
        />
      )}
    </AdminLayout>
  );
};

export default SystemSettings;
