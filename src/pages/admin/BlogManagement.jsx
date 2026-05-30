import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search, Plus, Edit2, Trash2, Eye, X, Save, ChevronDown } from 'lucide-react';
import ConfirmModal from '../../components/admin/ConfirmModal';
import toast from 'react-hot-toast';

// ── Mock blogs ──────────────────────────────────────────────────────────────
const MOCK_BLOGS = [
  { _id: '1', title: 'Getting Started with Alice Proctor',   author: 'Admin',  status: 'published', created_at: new Date().toISOString(),                  views: 1250, content: 'Alice Exam Proctor is an AI-powered online examination platform that uses computer vision to monitor students during exams. This guide walks you through setting up your first exam, inviting students, and reviewing results.' },
  { _id: '2', title: 'Top 5 Anti-Cheat Mechanisms in 2024',  author: 'System', status: 'draft',     created_at: new Date(Date.now()-86400000).toISOString(),  views: 0,    content: 'Online exam integrity is crucial. Here are the top 5 mechanisms used by Alice Proctor: Face Detection, Gaze Tracking, Tab Switch Detection, Multi-Person Detection, and Screen Recording Analysis.' },
  { _id: '3', title: 'Future of Online Exams',               author: 'Admin',  status: 'published', created_at: new Date(Date.now()-172800000).toISOString(), views: 3420, content: 'The landscape of online education has changed dramatically. AI-powered proctoring solutions are now the standard for secure remote assessments worldwide.' },
  { _id: '4', title: 'How AI Proctoring Reduces Cheating',   author: 'Admin',  status: 'published', created_at: new Date(Date.now()-259200000).toISOString(), views: 890,  content: 'Studies show that AI proctoring reduces cheating incidents by up to 85%. Here is how machine learning algorithms detect suspicious behaviour in real time.' },
];

const EMPTY_BLOG = { title: '', author: 'Admin', status: 'draft', content: '' };

// ── View Modal ────────────────────────────────────────────────────────────────
const ViewModal = ({ blog, onClose, onEdit }) => (
  <AnimatePresence>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#21262d] transition-colors">
          <X className="w-5 h-5 text-[#8b949e]" />
        </button>

        <div className="mb-4">
          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold mb-3 ${blog.status === 'published' ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'}`}>
            {blog.status}
          </span>
          <h2 className="text-2xl font-bold text-[#e6edf3] mb-2">{blog.title}</h2>
          <p className="text-xs text-[#8b949e]">By {blog.author} · {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · {blog.views.toLocaleString()} views</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-[#8b949e] text-sm leading-relaxed whitespace-pre-wrap">{blog.content}</p>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={() => { onClose(); onEdit(blog); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#2ea043] hover:bg-[#3fb950] text-white rounded-lg text-sm font-semibold transition-colors">
            <Edit2 size={14} /> Edit Post
          </button>
        </div>
      </motion.div>
    </div>
  </AnimatePresence>
);

// ── Create/Edit Modal ─────────────────────────────────────────────────────────
const EditModal = ({ blog, isNew, onClose, onSave }) => {
  const [form, setForm] = useState(blog ? { ...blog } : { ...EMPTY_BLOG });
  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = () => {
    if (!form.title.trim())   { toast.error('Title is required'); return; }
    if (!form.content.trim()) { toast.error('Content is required'); return; }
    onSave(form);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#21262d] transition-colors">
            <X className="w-5 h-5 text-[#8b949e]" />
          </button>

          <h2 className="text-xl font-bold text-[#e6edf3] mb-6">
            {isNew ? '✏️ Create New Post' : '✏️ Edit Post'}
          </h2>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#e6edf3] mb-1.5">Title *</label>
              <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="Enter a compelling title…"
                className="w-full px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-[#e6edf3] placeholder-[#8b949e] focus:ring-1 focus:ring-[#2ea043] focus:outline-none text-sm" />
            </div>

            {/* Author + Status row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#e6edf3] mb-1.5">Author</label>
                <input type="text" value={form.author} onChange={e => set('author', e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-[#e6edf3] focus:ring-1 focus:ring-[#2ea043] focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#e6edf3] mb-1.5">Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-[#e6edf3] focus:ring-1 focus:ring-[#2ea043] focus:outline-none text-sm">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-[#e6edf3] mb-1.5">Content *</label>
              <textarea value={form.content} onChange={e => set('content', e.target.value)}
                placeholder="Write your blog post content here…"
                rows={10}
                className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-xl text-[#e6edf3] placeholder-[#8b949e] focus:ring-1 focus:ring-[#2ea043] focus:outline-none text-sm resize-none leading-relaxed" />
              <p className="text-xs text-[#8b949e] mt-1">{form.content.length} characters</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={onClose}
              className="flex-1 py-2.5 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-[#e6edf3] rounded-xl text-sm font-medium transition-colors border border-[#30363d]">
              Cancel
            </button>
            <button onClick={handleSubmit}
              className="flex-1 py-2.5 bg-[#2ea043] hover:bg-[#3fb950] text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
              <Save size={14} /> {isNew ? 'Publish Post' : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const BlogManagement = () => {
  const [blogs, setBlogs]           = useState(MOCK_BLOGS);
  const [filtered, setFiltered]     = useState([]);
  const [searchQuery, setSearch]    = useState('');
  const [statusFilter, setStatus]   = useState('all');
  const [selectedBlog, setSelected] = useState(null);
  const [showDelete, setDelete]     = useState(false);
  const [showView, setView]         = useState(false);
  const [showEdit, setEdit]         = useState(false);
  const [isNew, setIsNew]           = useState(false);

  useEffect(() => {
    let list = [...blogs];
    if (searchQuery)  list = list.filter(b => b.title?.toLowerCase().includes(searchQuery.toLowerCase()) || b.author?.toLowerCase().includes(searchQuery.toLowerCase()));
    if (statusFilter !== 'all') list = list.filter(b => b.status === statusFilter);
    setFiltered(list);
  }, [blogs, searchQuery, statusFilter]);

  const openCreate = () => { setSelected(null); setIsNew(true); setEdit(true); };
  const openView   = (b) => { setSelected(b); setView(true); };
  const openEdit   = (b) => { setSelected(b); setIsNew(false); setEdit(true); };
  const openDelete = (b) => { setSelected(b); setDelete(true); };

  const handleSave = (form) => {
    if (isNew) {
      const newBlog = { ...form, _id: Date.now().toString(), created_at: new Date().toISOString(), views: 0 };
      setBlogs(prev => [newBlog, ...prev]);
      toast.success('Blog post created successfully!');
    } else {
      setBlogs(prev => prev.map(b => b._id === selected._id ? { ...b, ...form } : b));
      toast.success('Blog post updated successfully!');
    }
    setEdit(false);
  };

  const handleDelete = () => {
    setBlogs(prev => prev.filter(b => b._id !== selectedBlog._id));
    toast.success(`"${selectedBlog.title}" deleted.`);
    setDelete(false);
  };

  // For closure in handleSave
  const selected = selectedBlog;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#e6edf3]">Blog Management</h1>
            <p className="text-[#8b949e] mt-1">Create, edit and manage blog posts</p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#2ea043] hover:bg-[#3fb950] text-white rounded-lg transition-all font-semibold text-sm">
            <Plus className="w-4 h-4" /> Create Post
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total',     value: blogs.length,                                color: '#8b949e' },
            { label: 'Published', value: blogs.filter(b=>b.status==='published').length, color: '#3fb950' },
            { label: 'Drafts',    value: blogs.filter(b=>b.status==='draft').length,  color: '#e3b341' },
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
            <div className="md:col-span-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e]" />
              <input type="text" placeholder="Search by title or author…" value={searchQuery}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#e6edf3] placeholder-[#8b949e] focus:ring-1 focus:ring-[#2ea043] focus:outline-none" />
            </div>
            <select value={statusFilter} onChange={e => setStatus(e.target.value)}
              className="px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#e6edf3] focus:ring-1 focus:ring-[#2ea043] focus:outline-none">
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0d1117] border-b border-[#30363d]">
                <tr>
                  {['Title', 'Author', 'Status', 'Views', 'Date', 'Actions'].map((h, i) => (
                    <th key={h} className={`px-6 py-3 text-xs font-semibold text-[#8b949e] uppercase tracking-wider ${i === 5 ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]">
                {filtered.map(blog => (
                  <motion.tr key={blog._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="hover:bg-[#0d1117] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#e6edf3] text-sm max-w-xs truncate">{blog.title}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#8b949e]">{blog.author}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${blog.status === 'published' ? 'text-[#3fb950]' : 'text-[#e3b341]'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${blog.status === 'published' ? 'bg-[#3fb950]' : 'bg-[#e3b341]'}`} />
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#8b949e]">{blog.views.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-[#8b949e]">
                      {new Date(blog.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openView(blog)} title="View Post"
                          className="p-2 rounded-lg hover:bg-[#21262d] transition-colors group">
                          <Eye className="w-4 h-4 text-[#8b949e] group-hover:text-[#e6edf3]" />
                        </button>
                        <button onClick={() => openEdit(blog)} title="Edit Post"
                          className="p-2 rounded-lg hover:bg-[#21262d] transition-colors group">
                          <Edit2 className="w-4 h-4 text-[#3fb950]" />
                        </button>
                        <button onClick={() => openDelete(blog)} title="Delete Post"
                          className="p-2 rounded-lg hover:bg-red-900/20 transition-colors group">
                          <Trash2 className="w-4 h-4 text-[#f85149]" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#8b949e] text-lg">No blogs found</p>
              <button onClick={openCreate} className="mt-3 text-[#3fb950] text-sm hover:underline">
                Create your first post →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showView  && selectedBlog && <ViewModal blog={selectedBlog}  onClose={() => setView(false)}   onEdit={openEdit} />}
      {showEdit  &&                 <EditModal blog={selectedBlog}  isNew={isNew} onClose={() => setEdit(false)} onSave={handleSave} />}
      {showDelete && (
        <ConfirmModal
          title="Delete Blog Post"
          message={`Are you sure you want to permanently delete "${selectedBlog?.title}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDelete(false)}
          type="danger"
        />
      )}
    </AdminLayout>
  );
};

export default BlogManagement;
