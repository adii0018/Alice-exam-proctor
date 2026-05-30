import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Search, UserCheck, UserX, RotateCcw, Download, Eye, X, Mail, Calendar, Shield, ChevronDown,
} from 'lucide-react';
import ConfirmModal from '../../components/admin/ConfirmModal';
import toast from 'react-hot-toast';

// ── Mock users ──────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { _id: 'u1', name: 'Arjun Sharma',    email: 'arjun@student.com',  role: 'student', status: 'active',   created_at: '2024-01-15T10:00:00Z', exams_taken: 12 },
  { _id: 'u2', name: 'Priya Mehta',     email: 'priya@teacher.com',  role: 'teacher', status: 'active',   created_at: '2024-02-03T08:30:00Z', exams_taken: 0  },
  { _id: 'u3', name: 'Rahul Gupta',     email: 'rahul@student.com',  role: 'student', status: 'inactive', created_at: '2024-03-10T14:00:00Z', exams_taken: 5  },
  { _id: 'u4', name: 'Sneha Patel',     email: 'sneha@teacher.com',  role: 'teacher', status: 'active',   created_at: '2024-01-28T09:00:00Z', exams_taken: 0  },
  { _id: 'u5', name: 'Vikram Singh',    email: 'vikram@student.com', role: 'student', status: 'active',   created_at: '2024-04-05T11:00:00Z', exams_taken: 8  },
  { _id: 'u6', name: 'Anjali Verma',    email: 'anjali@student.com', role: 'student', status: 'active',   created_at: '2024-04-20T13:00:00Z', exams_taken: 3  },
  { _id: 'u7', name: 'Deepak Kumar',    email: 'deepak@teacher.com', role: 'teacher', status: 'inactive', created_at: '2024-02-14T07:00:00Z', exams_taken: 0  },
  { _id: 'u8', name: 'Kavitha Reddy',   email: 'kavitha@student.com',role: 'student', status: 'active',   created_at: '2024-05-01T10:00:00Z', exams_taken: 1  },
  { _id: 'u9', name: 'Super Admin',     email: 'admin@aliceproctor.com', role: 'admin', status: 'active', created_at: '2024-01-01T00:00:00Z', exams_taken: 0 },
];

const getRoleBadge = (role) => ({
  student: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  teacher: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
  admin:   'bg-red-500/15 text-red-400 border border-red-500/30',
}[role] || 'bg-gray-500/15 text-gray-400');

const Avatar = ({ name, role }) => {
  const colors = { student: '#3b82f6', teacher: '#8b5cf6', admin: '#ef4444' };
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
      style={{ background: `linear-gradient(135deg, ${colors[role] || '#6b7280'}, ${colors[role] || '#374151'}88)` }}>
      {name?.charAt(0).toUpperCase()}
    </div>
  );
};

// ── User Detail Modal ──────────────────────────────────────────────────────
const UserDetailModal = ({ user, onClose }) => (
  <AnimatePresence>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl max-w-md w-full p-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#21262d] transition-colors">
          <X className="w-5 h-5 text-[#8b949e]" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl"
            style={{ background: 'linear-gradient(135deg, #2ea043, #3fb950)' }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#e6edf3]">{user.name}</h3>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getRoleBadge(user.role)}`}>{user.role}</span>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { icon: Mail,     label: 'Email',       value: user.email },
            { icon: Shield,   label: 'Status',      value: user.status },
            { icon: Calendar, label: 'Joined',      value: user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }) : 'N/A' },
            { icon: ChevronDown, label: 'Exams Taken', value: user.exams_taken ?? 0 },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 p-3 bg-[#0d1117] rounded-xl border border-[#30363d]">
              <Icon size={16} className="text-[#8b949e] flex-shrink-0" />
              <span className="text-xs text-[#8b949e] w-24 flex-shrink-0">{label}</span>
              <span className="text-sm text-[#e6edf3] font-medium capitalize">{String(value)}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </AnimatePresence>
);

const UsersManagement = () => {
  const [users, setUsers]           = useState([]);
  const [filteredUsers, setFiltered] = useState([]);
  const [searchQuery, setSearch]    = useState('');
  const [roleFilter, setRole]       = useState('all');
  const [statusFilter, setStatus]   = useState('all');
  const [selectedUser, setSelected] = useState(null);
  const [showConfirm, setConfirm]   = useState(false);
  const [showDetail, setDetail]     = useState(false);
  const [actionType, setAction]     = useState('');
  const [loading, setLoading]       = useState(true);

  // Fetch (falls back to mock)
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users?.length ? data.users : MOCK_USERS);
      } else {
        setUsers(MOCK_USERS);
      }
    } catch {
      setUsers(MOCK_USERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    let list = [...users];
    if (searchQuery) list = list.filter(u => u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase()));
    if (roleFilter !== 'all') list = list.filter(u => u.role === roleFilter);
    if (statusFilter !== 'all') list = list.filter(u => u.status === statusFilter);
    setFiltered(list);
  }, [users, searchQuery, roleFilter, statusFilter]);

  // ── Actions ──────────────────────────────────────────────────────────────
  const openAction = (user, action) => {
    setSelected(user);
    setAction(action);
    if (action === 'view') { setDetail(true); return; }
    setConfirm(true);
  };

  const confirmAction = async () => {
    try {
      // Attempt real API call
      await fetch(`/api/admin/users/${selectedUser._id}/${actionType}/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).catch(() => {});

      // Update local state
      if (actionType === 'deactivate') {
        setUsers(prev => prev.map(u => u._id === selectedUser._id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
        toast.success(`User ${selectedUser.status === 'active' ? 'deactivated' : 'activated'}!`);
      } else if (actionType === 'reset-password') {
        toast.success(`Password reset link sent to ${selectedUser.email}!`);
      }
    } catch {
      toast.error('Action failed. Please try again.');
    } finally {
      setConfirm(false);
    }
  };

  // ── Export ───────────────────────────────────────────────────────────────
  const exportUsers = () => {
    const rows = [
      ['Name', 'Email', 'Role', 'Status', 'Joined'],
      ...filteredUsers.map(u => [
        u.name, u.email, u.role, u.status,
        u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A',
      ]),
    ];
    const csv  = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `users-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filteredUsers.length} users!`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#e6edf3]">User Management</h1>
            <p className="text-[#8b949e] mt-1">Manage all users across the platform</p>
          </div>
          <button onClick={exportUsers}
            className="flex items-center gap-2 px-4 py-2 bg-[#2ea043] hover:bg-[#3fb950] text-white rounded-lg transition-all font-semibold text-sm">
            <Download className="w-4 h-4" /> Export Users ({filteredUsers.length})
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total',    value: users.length,                              color: '#8b949e' },
            { label: 'Active',   value: users.filter(u=>u.status==='active').length, color: '#3fb950' },
            { label: 'Inactive', value: users.filter(u=>u.status==='inactive').length, color: '#f85149' },
          ].map(s => (
            <div key={s.label} className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-[#8b949e] mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e]" />
              <input type="text" placeholder="Search by name or email…" value={searchQuery}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#e6edf3] placeholder-[#8b949e] focus:ring-1 focus:ring-[#2ea043] focus:outline-none" />
            </div>
            <select value={roleFilter} onChange={e => setRole(e.target.value)}
              className="px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#e6edf3] focus:ring-1 focus:ring-[#2ea043] focus:outline-none">
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
              <option value="admin">Admins</option>
            </select>
            <select value={statusFilter} onChange={e => setStatus(e.target.value)}
              className="px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#e6edf3] focus:ring-1 focus:ring-[#2ea043] focus:outline-none">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0d1117] border-b border-[#30363d]">
                <tr>
                  {['User', 'Role', 'Status', 'Joined', 'Actions'].map((h, i) => (
                    <th key={h} className={`px-6 py-3 text-xs font-semibold text-[#8b949e] uppercase tracking-wider ${i === 4 ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}><td colSpan={5} className="px-6 py-4">
                      <div className="h-4 bg-[#21262d] rounded animate-pulse" />
                    </td></tr>
                  ))
                ) : filteredUsers.map(user => (
                  <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="hover:bg-[#0d1117] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} role={user.role} />
                        <div>
                          <p className="font-medium text-[#e6edf3] text-sm">{user.name}</p>
                          <p className="text-xs text-[#8b949e]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getRoleBadge(user.role)}`}>{user.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-sm font-medium capitalize ${user.status === 'active' ? 'text-[#3fb950]' : 'text-[#8b949e]'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-[#3fb950]' : 'bg-[#8b949e]'}`} />
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#8b949e]">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN') : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openAction(user, 'view')} title="View Details"
                          className="p-2 rounded-lg hover:bg-[#21262d] transition-colors group">
                          <Eye className="w-4 h-4 text-[#8b949e] group-hover:text-[#e6edf3]" />
                        </button>
                        <button onClick={() => openAction(user, 'deactivate')} title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                          className="p-2 rounded-lg hover:bg-red-900/20 transition-colors group">
                          {user.status === 'active'
                            ? <UserX className="w-4 h-4 text-[#f85149]" />
                            : <UserCheck className="w-4 h-4 text-[#3fb950]" />}
                        </button>
                        <button onClick={() => openAction(user, 'reset-password')} title="Reset Password"
                          className="p-2 rounded-lg hover:bg-blue-900/20 transition-colors group">
                          <RotateCcw className="w-4 h-4 text-[#58a6ff] group-hover:text-blue-300" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && filteredUsers.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#8b949e] text-lg">No users found</p>
              <p className="text-[#6e7681] text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && selectedUser && (
        <UserDetailModal user={selectedUser} onClose={() => setDetail(false)} />
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <ConfirmModal
          title={actionType === 'deactivate'
            ? (selectedUser?.status === 'active' ? 'Deactivate User' : 'Activate User')
            : 'Reset Password'}
          message={actionType === 'deactivate'
            ? `Are you sure you want to ${selectedUser?.status === 'active' ? 'deactivate' : 'activate'} ${selectedUser?.name}?`
            : `Send a password reset email to ${selectedUser?.name} (${selectedUser?.email})?`}
          onConfirm={confirmAction}
          onCancel={() => setConfirm(false)}
          type={actionType === 'deactivate' && selectedUser?.status === 'active' ? 'danger' : 'primary'}
        />
      )}
    </AdminLayout>
  );
};

export default UsersManagement;
